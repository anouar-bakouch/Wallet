from django.contrib import admin
from django.urls import path
from BudgetPRed.views import GetUserInfoView,ItemsCartAPIView,AddToCartAPIVIEW, ListMonthlyPurchaseView, ListPurchaseView,LoginView, PredictNextMonthMONTSTRUView, PurchaseView,refreshTokenView, AddItemView, DeleteItemView, GetItemView, GetUserView, ItemAPIView, ItemCategorieAPIView, PredictedItems, UpdateItemView, UpdateUserView, UserRegistrationView, index
urlpatterns = [
    path('',index),
    path('admin/', admin.site.urls),
    # ITEM ------------------------------
    path('add-item/', AddItemView.as_view()),
    path('update-item/<int:pk>/', UpdateItemView.as_view()),
    path('delete-item/<int:pk>/', DeleteItemView.as_view()),
    path('get-item/', GetItemView.as_view()),
    # CART 
    path('add-cart/', AddToCartAPIVIEW.as_view()), 
    path('get-cart/',ItemsCartAPIView.as_view()),
    path('delete-item/<int:pk>/',DeleteItemView.as_view()),
    #TOKEN 
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', LoginView.as_view(), name='token-obtain-pair'),
    path('auth/refresh/', refreshTokenView.as_view(), name='token-refresh'),
    # USER ------------------------------
    path('GetUser/<int:pk>/',GetUserView.as_view()),
    path('DeleteUser/<int:pk>/',DeleteItemView.as_view()),
    path('UpdateUser/<int:pk>/',UpdateUserView.as_view()),
    path('userinfo/<int:pk>/',GetUserInfoView.as_view(),name='user-info'),
    # PREDICTION ------------------------
    path('predict-items/<int:pk>/', PredictedItems.as_view(), name='PredictItems'),
    path('predict-budget/',PredictNextMonthMONTSTRUView.as_view(),name='PredictBudget'),
    # path('PredictMONTSTRU')
    path('list-item/',ItemAPIView.as_view() , name='list-item'),
    path('list-item-categorie/',ItemCategorieAPIView.as_view() , name='list-item-categorie'),
    # PURCHASE ---------------------------
    path('add-purchase/', PurchaseView.as_view()),
    path('list-purchase/', ListPurchaseView.as_view()),
    path('list-month-purchase/',ListMonthlyPurchaseView.as_view())
]

