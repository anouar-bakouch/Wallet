from django.contrib import admin
from .models import ItemPurchase, User, Item, Purchase

admin.site.register(User)
admin.site.register(Item)
admin.site.register(ItemPurchase)
admin.site.register(Purchase)

