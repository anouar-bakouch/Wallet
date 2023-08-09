from django.contrib import admin
from .models import User, Item, Purchase

admin.site.register(User)
admin.site.register(Item)
admin.site.register(Purchase)