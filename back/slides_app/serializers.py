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
        fields = ['id', 'name', 'ordering', 'question_id']
        ordering = ['ordering']


class StringArrayField(ListField):
    def to_representation(self, obj):
        obj = super().to_representation(obj)
        return ",".join([str(element) for element in obj])

    def to_internal_value(self, data):
        data = data[0].split(",")
        return super().to_internal_value(data)


class PresentationSerializer(ModelSerializer):
    user = UserSerializer()
    slide_set = serializers.SerializerMethodField()
    tags = StringArrayField()

    class Meta:
        model = Presentation
        fields = ['id', 'user', 'title', 'slide_set', 'topic', 'tags', 'description', 'privacy', 'url', 'date_created']

    def get_slide_set(self, instance):
        slides = instance.slide_set.all().order_by('ordering')
        return SlideSerializer(slides, many=True).data


class CreatePresentationSerializer(ModelSerializer):
    tags = StringArrayField(default=[], allow_empty=True)

    class Meta:
        model = Presentation
        fields = ['title', 'topic', 'tags', 'privacy']


class LeadSerializer(ModelSerializer):
    class Meta:
        model = Lead
        fields = ['email', 'first_name', 'last_name']


class AnswerSerializer(ModelSerializer):
    slides = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ['id', 'slides', 'answer_text']

    def get_slides(self, instance):
        slides = instance.slides.all().order_by('ordering')
        return SlideSerializer(slides, many=True).data


class QuestionSerializer(ModelSerializer):
    answer_set = AnswerSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = ['question_text', 'answer_set']


class CreateUpdateAnswerSerializer(ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text']


class CreateQuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'slide_id', 'question_text']
