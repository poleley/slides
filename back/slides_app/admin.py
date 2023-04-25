from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from slides_app.models import Presentation, Lead


class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name',)
    readonly_fields = ('id',)


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Presentation)
admin.site.register(Lead)
