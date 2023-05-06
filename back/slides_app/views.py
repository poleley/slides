import json
import os

from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from slides_app.models import Presentation, Lead, Slide
from slides_app.serializers import UserSerializer, PresentationSerializer, LeadSerializer, CreatePresentationSerializer, \
    SlideSerializer, CreateUserSerializer
from slides_app.utils import IsOwner, PdfConverter, NoCsrfSessionAuthentication


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
            serializer = UserSerializer(user)
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
    permission_classes = [IsOwner]
    parser_classes = [MultiPartParser]

    def get_permissions(self):
        permission_classes = super().get_permissions()
        if self.action in ["create", "partial_update", "destroy"]:
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
            presentation.description["views"]["total_views"] += 1
            presentation.save()
        serializer = self.get_serializer(presentation)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset()
        keys = ["tags__contains", "topic", "user_id"]
        errors = {}
        for key in keys:
            if self.request.query_params.get(key) is not None:
                val = self.request.query_params.get(key)
                if key.endswith("__contains"):
                    val = [v for v in val.split(",")]
                try:
                    queryset = queryset.filter(**{key: val})
                except ValidationError as exc:
                    errors[key] = exc.messages[0]
                except ValueError as exc:
                    errors[key] = str(exc)

        if errors:
            raise serializers.ValidationError(errors)

        if self.request.query_params.get("user_id") is None:
            queryset = queryset.filter(privacy=1)
            queryset = queryset.order_by("-description__views__total_views", "-date_created")

        return queryset

    def perform_create(self, serializer):
        description = {
            "lead": False,
            "interactivity": False,
            "stars": 0,
            "views": {"total_views": 0}
        }
        presentation = serializer.save(user=self.request.user, description=description)
        file_to_import = self.request.FILES.get("file")
        converter = PdfConverter()
        slides = converter.convert(file_to_import)
        for index, img_name in enumerate(slides):
            Slide.objects.create(presentation_id=presentation.id, name=img_name, ordering=index)

    def perform_update(self, serializer):
        description = json.loads(self.request.data["description"])
        serializer.save(description=description)

    def perform_destroy(self, instance):
        slides = Slide.objects.filter(presentation_id=instance.id)
        for slide in slides:
            slides2 = Slide.objects.filter(name__exact=slide.name).exclude(pk=slide.pk)
            if len(slides2) == 0:
                os.remove(f'slides_app/slides/{slide.name}')
        instance.delete()


class LeadViewSet(ModelViewSet):
    authentication_classes = [NoCsrfSessionAuthentication]
    serializer_class = LeadSerializer
    queryset = Lead.objects.all()

    def get_queryset(self):
        leads = get_object_or_404(
            Presentation.objects.all(), id=self.kwargs["presentation_id"]
        ).lead_set.defer("presentation").all()
        return leads

    def perform_create(self, serializer):
        presentation = get_object_or_404(Presentation, id=self.kwargs["presentation_id"])
        slide = get_object_or_404(Slide, id=self.request.data["slide"])
        if self.request.user.is_authenticated:
            user = self.request.user
            serializer.save(presentation=presentation, slide=slide, email=user.email, last_name=user.last_name, first_name=user.first_name)
        else:
            serializer.save(presentation=presentation, slide=slide)
