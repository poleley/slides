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
    PUBLIC = 1, _("Достуно всем")
    LIMITED = 2, _("Ограниченный доступ")
    PRIVATE = 3, _("Приватно")


class Presentation(models.Model):
    user = models.ForeignKey(User, null=False, blank=False, on_delete=models.CASCADE)
    title = models.CharField(null=False, blank=False, max_length=255)
    slides = ArrayField(
        models.CharField(max_length=64, null=False, blank=False),
        null=False,
        blank=False
    )
    topic = models.IntegerField(choices=Topic.choices, null=False, blank=False)
    tags = models.CharField(null=True, blank=True, max_length=100)
    description = models.JSONField(null=False, blank=False)
    privacy = models.IntegerField(choices=Privacy.choices, null=False, blank=False)


class Lead(models.Model):
    presentation = models.ForeignKey(Presentation, null=False, blank=False, on_delete=models.CASCADE)
    slide = models.IntegerField(null=False, blank=False)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(null=True, blank=True, max_length=30)
    first_name = models.CharField(null=True, blank=True, max_length=100)
    last_name = models.CharField(null=True, blank=True, max_length=100)


class File(models.Model):
    id = models.CharField(primary_key=True, max_length=64)
