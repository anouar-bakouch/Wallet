from django.contrib import admin
from .models import ItemPurchase, User, Item, Purchase , MonthlyBudget

admin.site.register(User)
admin.site.register(Item)
admin.site.register(ItemPurchase)
admin.site.register(Purchase)
admin.site.register(MonthlyBudget)
