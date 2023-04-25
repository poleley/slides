from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from slides_app.models import Presentation, Lead


def min_length(value):
    if len(value) < 8:
        raise serializers.ValidationError('Password length must be greater than 8 characters.')


class UserSerializer(ModelSerializer):
    first_name = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
    last_name = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
    password = serializers.CharField(write_only=True, validators=[min_length])

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user


class PresentationSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Presentation
        fields = '__all__'


class CreatePresentationSerializer(ModelSerializer):
    class Meta:
        model = Presentation
        fields = ['title', 'slides', 'topic', 'tags', 'description', 'privacy', 'url']


class LeadSerializer(ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'


class FileUploadSerializer(serializers.Serializer):
    file_uploaded = serializers.FileField()

    class Meta:
        fields = ["file_uploaded"]