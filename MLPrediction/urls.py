from django.contrib import admin
from django.urls import path
from BudgetPRed.views import BudgetView # Importing the BudgetView class

urlpatterns = [
    path('admin/', admin.site.urls),
    path('budget/', BudgetView.as_view(), name='budget'),
    
]
