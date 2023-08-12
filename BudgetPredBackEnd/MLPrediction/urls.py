from django.contrib import admin
from django.urls import path
from BudgetPRed.views import TokenObtainPairView, AddItemView, DeleteItemView, GetItemView, GetUserView, ItemAPIView, ItemCategorieAPIView, PredictedItems, UpdateItemView, UpdateUserView, index, signInView, signUpView
urlpatterns = [
    path('',index),
    path('admin/', admin.site.urls),
    # ITEM ------------------------------
    path('add-item/', AddItemView.as_view()),
    path('update-item/<int:pk>/', UpdateItemView.as_view()),
    path('delete-item/<int:pk>/', DeleteItemView.as_view()),
    path('get-item/<int:pk>/', GetItemView.as_view()),
    #TOKEN 
    path('token/',TokenObtainPairView.as_view()),
    # USER ------------------------------
    path('SignIn/',signInView.as_view()),
    path('SignUp/',signUpView.as_view()),
    path('GetUser/<int:pk>/',GetUserView.as_view()),
    path('DeleteUser/<int:pk>/',DeleteItemView.as_view()),
    path('UpdateUser/<int:pk>/',UpdateUserView.as_view()),
    # PREDICTION ------------------------
    path('predict-items/<int:pk>/', PredictedItems.as_view(), name='PredictItems'),
    # path('PredictMONTSTRU')
    path('list-item/',ItemAPIView.as_view() , name='list-item'),
    path('list-item-categorie/',ItemCategorieAPIView.as_view() , name='list-item-categorie'),
]

