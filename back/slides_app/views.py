from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from slides_app.models import Presentation, Lead
from slides_app.serializers import UserSerializer, PresentationSerializer, LeadSerializer, CreatePresentationSerializer, \
    FileUploadSerializer
from slides_app.utils import IsOwner, PdfConverter, NoCsrfSessionAuthentication


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
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

    def get_permissions(self):
        permission_classes = super().get_permissions()
        if self.action in ["create", "partial_update", "destroy"]:
            permission_classes.append(IsAuthenticated())
        return permission_classes

    def get_serializer_class(self):
        if self.action == "create":
            return CreatePresentationSerializer
        return super().get_serializer_class()

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

        return queryset

    def perform_create(self, serializer):
        description = {
            "lead": False,
            "stars": 0,
            "views": {}
        }
        serializer.save(user=self.request.user, description=description)


class LeadViewSet(ModelViewSet):
    serializer_class = LeadSerializer
    queryset = Lead.objects.all()

    def get_queryset(self):
        leads = get_object_or_404(
            Presentation.objects.all(), id=self.kwargs["presentation_id"]
        ).lead_set.defer("presentation").all()
        return leads

    def perform_create(self, serializer):
        presentation = get_object_or_404(Presentation, id=self.kwargs["presentation_id"])
        # if self.request.user.is_authenticated:
        #     user = self.request.user
        #     serializer.save(email=user.email, last_name=user.last_name, first_name=user.first_name)
        serializer.save(presentation=presentation)


class FileImport(ViewSet):
    serializer_class = FileUploadSerializer
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def convert(self, request):
        file_to_import = request.FILES.get("file")
        converter = PdfConverter()
        slides = converter.convert(file_to_import)
        return Response(slides)
