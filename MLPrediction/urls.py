from django.contrib import admin
from django.urls import path
from BudgetPRed.views import AddBudgetView, DeleteBudgetView, ListBudgetView, UpdateBudgetView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('add-budget/', AddBudgetView.as_view()),
    path('list-budget/', ListBudgetView.as_view()),
    path('update-budget/<int:pk>/', UpdateBudgetView.as_view()),
    path('delete-budget/<int:pk>/', DeleteBudgetView.as_view()),
]


