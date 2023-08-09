from django.contrib import admin
from django.urls import path
from BudgetPRed.views import AddBudgetView, DeleteBudgetView, GetBudgetView, ListBudgetView, PredictBudgetView, PredictedItems, TokenPairObtainView, TokenRefreshView, TokenVerifyView, UpdateBudgetView, index, signInView, signUpView
urlpatterns = [
    path('',index),
    path('admin/', admin.site.urls),
    path('add-budget/', AddBudgetView.as_view()),
    path('list-budget/', ListBudgetView.as_view()),
    path('update-budget/<int:pk>/', UpdateBudgetView.as_view()),
    path('delete-budget/<int:pk>/', DeleteBudgetView.as_view()),
    path('predict-budget/<int:pk>/', PredictBudgetView.as_view()),
    path('get-budget/<int:pk>/', GetBudgetView.as_view()),
    path('SignIn/',signInView.as_view()),
    path('SignUp/',signUpView.as_view()),
    path('GetUser/<int:pk>/',GetBudgetView.as_view()),
    path('DeleteUser/<int:pk>/',DeleteBudgetView.as_view()),
    path('UpdateUser/<int:pk>/',UpdateBudgetView.as_view()),
    path('token/', TokenPairObtainView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('PredictBudget/<int:pk>/', PredictBudgetView.as_view(), name='PredictBudget'),
    path('PredictItems/<int:pk>/', PredictedItems.as_view(), name='PredictItems'),
    # path('PredictMONTSTRU')

]

