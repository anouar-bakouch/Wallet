from django.contrib import admin

# Register your models here.

from .models import Budget,User

admin.site.register(Budget)
admin.site.register(User)
