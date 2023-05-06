from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.fields import ListField

from slides_app.models import Presentation, Lead, Slide, Question, Answer


def min_length(value):
    if len(value) < 8:
        raise serializers.ValidationError('Password length must be greater than 8 characters.')


class CreateUserSerializer(ModelSerializer):
    first_name = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
    last_name = serializers.CharField(max_length=255, allow_null=False, allow_blank=False)
    password = serializers.CharField(write_only=True, validators=[min_length])

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password']

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name']
            )
        except:
            raise serializers.ValidationError({"email": "User with this email already exists"})
        return user


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'last_name', 'first_name']


class SlideSerializer(ModelSerializer):
    class Meta:
        model = Slide
        fields = ['id', 'name', 'ordering']


class PresentationSerializer(ModelSerializer):
    user = UserSerializer()
    slide_set = SlideSerializer(many=True)

    class Meta:
        model = Presentation
        fields = ['id', 'user', 'title', 'slide_set', 'topic', 'tags', 'description', 'privacy', 'url', 'date_created']


class CreatePresentationSerializer(ModelSerializer):
    class Meta:
        model = Presentation
        fields = ['title', 'topic', 'tags', 'privacy']

    def create(self, validated_data):
        if 'tags' in validated_data:
            validated_data['tags'] = validated_data['tags'][0].split(',')
        return super().create(validated_data)


class LeadSerializer(ModelSerializer):
    class Meta:
        model = Lead
        fields = ['email', 'first_name', 'last_name']


class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_text']


class AnswerSerializer(ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer_text']
