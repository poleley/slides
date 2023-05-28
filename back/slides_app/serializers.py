from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer, ListSerializer
from rest_framework import serializers

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


class IdsSerializer(serializers.Serializer):
    id = serializers.IntegerField(allow_null=False)


class PresentationSerializer(ModelSerializer):
    user = UserSerializer()
    slide_set = serializers.SerializerMethodField(method_name='get_slide_set')
    favorite = serializers.SerializerMethodField(method_name='get_favorite_ids')

    class Meta:
        model = Presentation
        fields = ['id', 'user', 'favorite', 'title', 'slide_set', 'topic', 'description', 'privacy', 'date_created']

    def get_slide_set(self, instance):
        slides = instance.slide_set.all().order_by('ordering')
        return SlideSerializer(slides, many=True).data

    def get_favorite_ids(self, instance):
        return instance.favorite.values_list("id", flat=True)


class CreatePresentationSerializer(ModelSerializer):
    class Meta:
        model = Presentation
        fields = ['title', 'topic', 'privacy']


class LeadSerializer(ModelSerializer):
    slide = SlideSerializer(read_only=True)

    class Meta:
        model = Lead
        fields = ['slide', 'email', 'first_name', 'last_name']


class AnswerSerializer(ModelSerializer):
    slides = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = ['id', 'slides', 'answer_text', 'chosen_count']

    def get_slides(self, instance):
        slides = instance.slides.all().order_by('ordering')
        return SlideSerializer(slides, many=True).data


class QuestionSerializer(ModelSerializer):
    answer_set = AnswerSerializer(read_only=True, many=True)
    slide_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Question
        fields = ['id', 'slide_id', 'question_text', 'answer_set']


class CreateUpdateAnswerSerializer(ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'chosen_count']


class QuestionInStatisticsSerializer(ModelSerializer):
    answer_set = CreateUpdateAnswerSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'answer_set']
