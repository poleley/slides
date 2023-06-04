import datetime
import json
import os

from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from slides_app.models import Presentation, Lead, Slide, Question, Answer, Privacy
from slides_app.serializers import PresentationSerializer, LeadSerializer, CreatePresentationSerializer, \
    CreateUserSerializer, QuestionSerializer, AnswerSerializer, CreateUpdateAnswerSerializer, SlideSerializer
from slides_app.utils import IsPresentationOwner, PdfConverter, NoCsrfSessionAuthentication, \
    IsQuestionOwner, IsAnswerOwner


class UserViewSet(ModelViewSet):
    serializer_class = CreateUserSerializer
    authentication_classes = [NoCsrfSessionAuthentication]

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response(
                status=status.HTTP_200_OK,
                data={"detail: User already authenticated."}
            )
        res = super().create(request)
        user = User.objects.get(email=request.data["email"])
        login(request, user)
        return res

    def login(self, request):
        user = get_object_or_404(User.objects.all(), email=request.data["email"])
        if user.check_password(request.data["password"]):
            login(request, user)
            serializer = CreateUserSerializer(user)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            data={"detail: Wrong password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    def logout(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class PresentationViewSet(ModelViewSet):
    lookup_url_kwarg = "presentation_id"
    serializer_class = PresentationSerializer
    queryset = Presentation.objects.all()
    authentication_classes = [NoCsrfSessionAuthentication]
    permission_classes = [IsPresentationOwner]
    parser_classes = [MultiPartParser, JSONParser]

    def get_permissions(self):
        permission_classes = super().get_permissions()
        if self.action in ["create", "partial_update", "destroy", "statistics"]:
            permission_classes.append(IsAuthenticated())
        return permission_classes

    def get_serializer_class(self):
        if self.action == "create":
            return CreatePresentationSerializer
        return super().get_serializer_class()

    def get_object(self):
        obj = get_object_or_404(Presentation.objects.all(), pk=self.kwargs["presentation_id"])
        self.check_object_permissions(self.request, obj)
        return obj

    def retrieve(self, request, *args, **kwargs):
        presentation = self.get_object()
        if request.query_params.get("edit") is None:
            date = datetime.datetime.now().isoformat()[:10]
            if date in presentation.description["views"]:
                presentation.description["views"][date] += 1
            else:
                presentation.description["views"][date] = 1
            presentation.description["views"]["total_views"] += 1
            presentation.save()
        serializer = self.get_serializer(presentation)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset()
        keys = ["topic", "user_id", "favorite__id"]
        errors = {}
        for key in keys:
            if self.request.query_params.get(key) is not None:
                val = self.request.query_params.get(key)
                try:
                    queryset = queryset.filter(**{key: val})
                except ValidationError as exc:
                    errors[key] = exc.messages[0]
                except ValueError as exc:
                    errors[key] = str(exc)

        if errors:
            raise serializers.ValidationError(errors)

        if (
                self.request.query_params.get("user_id") is None or
                self.request.query_params.get("favorite__id") is not None
        ):
            queryset = queryset.filter(privacy=Privacy.PUBLIC)
            queryset = queryset.order_by("-description__views__total_views", "-date_created")

        return queryset

    def perform_create(self, serializer):
        description = {
            "lead": {},
            "favorite": {"total_favorite": 0, "users_by_date": {}},
            "views": {"total_views": 0}
        }
        file_to_import = self.request.FILES.get("file")
        if file_to_import is None:
            raise serializers.ValidationError({"file": "This field is required."})
        if file_to_import.name.rsplit(".", 1)[-1] != "pdf":
            raise serializers.ValidationError({"file": "Wrong file extension. .pdf expected"})
        presentation = serializer.save(user=self.request.user, description=description)
        converter = PdfConverter()
        slides = converter.convert(file_to_import)
        for index, img_name in enumerate(slides):
            Slide.objects.create(presentation_id=presentation.id, name=img_name, ordering=index)

    def perform_update(self, serializer):
        description = json.loads(self.request.data["description"])
        for slide_id in description["lead"]:
            try:
                Question.objects.get(slide_id=slide_id)
                raise serializers.ValidationError({"detail": "Slide already has question"})
            except Question.DoesNotExist:
                pass
        serializer.save(description=description)

    def perform_destroy(self, instance):
        slides = Slide.objects.filter(presentation_id=instance.id)
        for slide in slides:
            slides_in_other_presentations = Slide.objects.filter(name__exact=slide.name).exclude(pk=slide.pk)
            if len(slides_in_other_presentations) == 0:
                os.remove(f'slides_app/slides/{slide.name}')
        instance.delete()

    def add_to_favorite(self, request, *args, **kwargs):
        presentation = self.get_object()
        presentation.favorite.add(User.objects.get(id=request.user.id))
        date = datetime.datetime.now().isoformat()[:10]
        presentation.description["favorite"]["users_by_date"][request.user.id] = date
        if date in presentation.description["favorite"]:
            presentation.description["favorite"][date] += 1
        else:
            presentation.description["favorite"][date] = 1
        presentation.description["favorite"]["total_favorite"] += 1
        presentation.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def remove_from_favorite(self, request, *args, **kwargs):
        presentation = self.get_object()
        presentation.favorite.remove(User.objects.get(id=request.user.id))
        date_to_unfavorite = presentation.description["favorite"]["users_by_date"][str(request.user.id)]
        presentation.description["favorite"][date_to_unfavorite] -= 1
        del presentation.description["favorite"]["users_by_date"][str(request.user.id)]
        presentation.description["favorite"]["total_favorite"] -= 1
        presentation.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def statistics(self, request, *args, **kwargs):
        presentation = self.get_object()
        date_2_weeks_ago = datetime.datetime.now() - datetime.timedelta(days=14)
        views_by_date = {}
        favorite_by_date = {}
        for i in range(0, 15):
            date = date_2_weeks_ago + datetime.timedelta(days=i)
            views_by_date[date.strftime("%d.%m")] = presentation.description["views"].get(date.isoformat()[:10], 0)
            favorite_by_date[date.strftime("%d.%m")] = presentation.description["favorite"].get(date.isoformat()[:10], 0)
        slides = presentation.slide_set.all()
        data = {
            "user_id": presentation.user.id,
            "title": presentation.title,
            "date_created": presentation.date_created,
            "total_views": presentation.description["views"]["total_views"],
            "views": views_by_date,
            "total_favorite": presentation.description["favorite"]["total_favorite"],
            "favorite": favorite_by_date,
            "first_slide": SlideSerializer(slides[0]).data,
            "leads": [],
            "questions": []
        }

        for slide in slides:
            try:
                question = QuestionSerializer(slide.question_id).data
                data["questions"].append(question)
            except Question.DoesNotExist:
                pass
            if presentation.description["lead"]:
                leads = slide.lead_set.all()
                data["leads"] += LeadSerializer(leads, many=True).data

        return Response(data, status.HTTP_200_OK)


class QuestionViewSet(ModelViewSet):
    authentication_classes = [NoCsrfSessionAuthentication]
    permission_classes = [IsQuestionOwner]
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def get_permissions(self):
        permission_classes = super().get_permissions()
        if self.action in ["create", "partial_update", "destroy"]:
            permission_classes.append(IsAuthenticated())
        return permission_classes

    def get_object(self):
        question = get_object_or_404(Question.objects.all(), pk=self.kwargs["question_id"])
        self.check_object_permissions(self.request, question)
        return question

    def retrieve(self, request, *args, **kwargs):
        question = self.get_object()
        serializer = self.get_serializer(question)
        return Response(serializer.data)

    def perform_create(self, serializer):
        try:
            slide = get_object_or_404(Slide.objects.all(), pk=self.request.data["slide_id"])
            if slide.presentation.user != self.request.user:
                return Response(
                    status=status.HTTP_403_FORBIDDEN,
                    data={"detail": "You are not owner of the presentation"}
                )
        except KeyError:
            raise serializers.ValidationError({"slide_id": "This field is required"})
        except Slide.DoesNotExist:
            raise serializers.ValidationError({"slide_id": "Slide with this id doesn't exist"})
        if len(Question.objects.filter(slide=slide)) != 0:
            raise serializers.ValidationError({"slide_id": "Slide with this id already has a question"})
        serializer.save(slide=slide)


class AnswerViewSet(ModelViewSet):
    authentication_classes = [NoCsrfSessionAuthentication]
    permission_classes = [IsAnswerOwner & IsAuthenticated]
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    lookup_url_kwarg = "answer_id"

    def get_serializer_class(self):
        if self.action == "create" or self.action == "partial_update":
            return CreateUpdateAnswerSerializer
        return super().get_serializer_class()

    def get_serializer(self, *args, **kwargs):
        if self.action == "create":
            kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        question = get_object_or_404(Question.objects.all(), pk=self.kwargs["question_id"])
        if question.slide.presentation.user != self.request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"detail": "You are not owner of the presentation"})
        for answer in self.request.data:
            if "slides_ids" not in answer:
                raise serializers.ValidationError({"slides_ids": "This field is required"})
        new_answers = serializer.save(question=question)
        for index, answer in enumerate(self.request.data):
            for slide_id in answer["slides_ids"]:
                try:
                    new_answers[index].slides.add(Slide.objects.get(pk=slide_id))
                except Slide.DoesNotExist:
                    raise serializers.ValidationError({"slides_ids": f"Slide with id {slide_id} doesn't exist"})

    def perform_update(self, serializer):
        answer = self.get_object()
        if "slides_ids" in self.request.data:
            slides = Slide.objects.filter(answer__id=answer.id)
            old_slides_ids = []
            for slide in slides:
                old_slides_ids.append(slide.id)

            for slide_id in old_slides_ids:
                if slide_id not in self.request.data["slides_ids"]:
                    answer.slides.remove(Slide.objects.get(pk=slide_id))

            for slide_id in self.request.data["slides_ids"]:
                if slide_id not in old_slides_ids:
                    try:
                        answer.slides.add(Slide.objects.get(pk=slide_id))
                    except Slide.DoesNotExist:
                        raise serializers.ValidationError({"slides_ids": f"Slide with id {slide_id} doesn't exist"})
        serializer.save()

    def choose(self, request, *args, **kwargs):
        answer = self.get_object()
        answer.chosen_count += 1
        answer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LeadViewSet(ModelViewSet):
    authentication_classes = [NoCsrfSessionAuthentication]
    serializer_class = LeadSerializer
    queryset = Lead.objects.all()

    def get_queryset(self):
        slide = get_object_or_404(Slide.objects.all(), id=self.kwargs["slide_id"])
        leads = slide.lead_set.all()
        return leads

    def perform_create(self, serializer):
        slide = get_object_or_404(Slide.objects.all(), id=self.kwargs["slide_id"])
        presentation = slide.presentation
        if presentation.privacy == Privacy.PRIVATE or not presentation.description["lead"]:
            raise serializers.ValidationError(
                {"detail": "Presentation is not public or leads not enabled"}
            )
        if self.request.user.is_authenticated:
            user = self.request.user
            if Lead.objects.filter(slide__presentation_id=presentation.id, email=user.email):
                raise serializers.ValidationError(
                    {"detail": "You have already sent your contacts"}
                )
            serializer.save(slide=slide, email=user.email, last_name=user.last_name, first_name=user.first_name)
        else:
            if Lead.objects.filter(slide__presentation_id=presentation.id, email=self.request.data["email"]):
                raise serializers.ValidationError(
                    {"detail": "You have already sent your contacts"}
                )
            serializer.save(slide=slide)
