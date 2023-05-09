from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import ArrayField


class Topic(models.IntegerChoices):
    ART = 1, _("Искусство")
    BUSINESS = 2, _("Бизнес")
    DESIGN = 3, _("Дизайн")
    ECONOMY = 4, _("Экономика")
    EDUCATION = 5, _("Образование")
    HEALTH = 6, _("Здоровье")
    LAW = 7, _("Закон")
    MARKETING = 8, _("Маркетинг")
    SCIENCE = 9, _("Наука")
    SELF_EDUCATION = 10, _("Самообразование")
    SPORTS = 11, _("Спорт")
    TECHNOLOGY = 12, _("Технологии")
    TRAVEL = 13, _("Путешествия")


class Privacy(models.IntegerChoices):
    PUBLIC = 1, _("Доступно всем")
    LIMITED = 2, _("Ограниченный доступ")
    PRIVATE = 3, _("Приватно")


class Presentation(models.Model):
    user = models.ForeignKey(User, null=False, blank=False, on_delete=models.CASCADE)
    title = models.CharField(null=False, blank=False, max_length=255)
    topic = models.IntegerField(choices=Topic.choices, null=False, blank=False)
    tags = ArrayField(
        models.CharField(null=False, blank=False, max_length=100),
        null=True,
        blank=True
    )
    description = models.JSONField(null=False, blank=False)
    privacy = models.IntegerField(choices=Privacy.choices, null=False, blank=False)
    url = models.URLField(null=True, blank=True)
    date_created = models.DateField(auto_now_add=True)


class Slide(models.Model):
    presentation = models.ForeignKey(Presentation, null=False, blank=False, on_delete=models.CASCADE)
    name = models.CharField(max_length=68, null=False, blank=False)
    ordering = models.IntegerField(null=False, blank=False)


class Lead(models.Model):
    slide = models.ForeignKey(Slide, null=False, blank=False, on_delete=models.CASCADE)
    email = models.EmailField(null=False, blank=False)
    first_name = models.CharField(null=False, blank=False, max_length=100)
    last_name = models.CharField(null=False, blank=False, max_length=100)


class Question(models.Model):
    slide = models.OneToOneField(Slide, null=False, blank=False, on_delete=models.CASCADE, related_name='question_id')
    question_text = models.CharField(null=False, blank=False, max_length=255)


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    slides = models.ManyToManyField(Slide)
    answer_text = models.CharField(null=False, blank=False, max_length=255)
