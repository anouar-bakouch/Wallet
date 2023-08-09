
import pickle
from django.shortcuts import get_object_or_404, render
import joblib
from BudgetPRed.serializers import ItemSerializer,PurchaseSerializer, TokenPairSerializer, TokenRefreshSerializer, TokenVerifySerializer, UserSerializer
from BudgetPRed.models import Item, Pagination, User , Purchase
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
import numpy as np



def index(request):
    # return index.html in templates folder
    return render(request, 'index.html')

# budgets 

class AddItemView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            budget_saved = serializer.save()
            return Response(
                {"success": f"Budget '{budget_saved.IDEIMPST}' created successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListItemsView(APIView):
    def get(self, request):
        budgets = Item.objects.all()
        serializer = ItemSerializer(budgets, many=True)
        return Response({"budgets": serializer.data})


class UpdateItemView(APIView):
    def put(self, request, pk):
        saved_budget = get_object_or_404(Item.objects.all(), pk=pk)
        data = request.data.get('budget')
        serializer = ItemSerializer(instance=saved_budget, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            budget_saved = serializer.save()
        return Response({
            "success": "Budget '{}' updated successfully".format(budget_saved.IDEIMPST)
        })
    
class DeleteItemView(APIView):
    def delete(self, request, pk):
        # Get object with this pk
        budget = get_object_or_404(Item.objects.all(), pk=pk)
        budget.delete()
        return Response({
            "message": "Budget with id `{}` has been deleted.".format(pk)
        }, status=204)
    
    
class GetItemView(APIView):
    def get(self, request, pk):
        # Get object with this pk
        budget = get_object_or_404(Item.objects.all(), pk=pk)
        serializer = ItemSerializer(budget)
        return Response({"budget": serializer.data})

# Purchase views 

    
class PredictNextMonthMONTSTRUView(APIView):
    def post(self, request):
        # Load the ARIMA model from the pickle file
        model = joblib.load('models/ForecastMONTSTRUmodel.pkl')

        # Get the user's ID from the request
        user_id = request.data.get('user_id')

        # Get the user's purchase history from the request
        purchase_history = request.data.get('purchase_history', [])

        # Get the user's budget and spending behavior from the request
        budget = request.data.get('budget')
        spending_behavior = request.data.get('spending_behavior')

        # Preprocess the user's data
        user_data = pd.DataFrame({
            'user_id': [user_id],
            'purchase_date': pd.to_datetime(purchase_history),
            'MONTSTRU': [sum(purchase_history)],
            'MONTRAPP': [budget - sum(purchase_history) * spending_behavior]
        })

        # Perform time series analysis and generate the forecast for the next month
        user_monthly_expenses = user_data.groupby(pd.Grouper(key='purchase_date', freq='M')).sum()['MONTSTRU']
        user_model_fit = model.filter(user_monthly_expenses)
        user_forecast = user_model_fit.forecast(steps=1)[0]

        return Response({'next_month_montstru': user_forecast})
    
class PredictedItems(APIView):
    def get(self,request):
        model = pickle.load(open('models/PredictReco_model.pkl', 'rb'))
        # Get the user's ID from the request
        user_id = request.data.get('user_id')
        user_items = request.data.get('items')
        # convert the user_items into a numerical representatiol 
        input_items = np.array([user_items])
        # make the prediction
        prediction = model.predict(user_id,input_items)
        # return the prediction
        return Response({"prediction": prediction.tolist()})

class ListUserView(APIView):

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"users": serializer.data})

class GetUserView(APIView):
    def get(self, request, pk):
        # Get object with this pk
        user = get_object_or_404(User.objects.all(), pk=pk)
        serializer = UserSerializer(user)
        return Response({"user": serializer.data})
    
class signUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({"success": "User '{}' created successfully".format(user.id)}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class signInView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username, password=password).first()
        if user is None:
            return Response({"error": "Wrong username or password"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"success": "User '{}' signed in successfully".format(user.id)}, status=status.HTTP_200_OK)
        

class UpdateUserView(APIView):
    def put(self, request, pk):
        saved_user = get_object_or_404(User.objects.all(), pk=pk)
        data = request.data.get('user')
        serializer = UserSerializer(instance=saved_user, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            user_saved = serializer.save()
        return Response({
            "success": "User '{}' updated successfully".format(user_saved.id)
        })
    
class DeleteUserView(APIView):
    def delete(self, request, pk):
        # Get object with this pk
        user = get_object_or_404(User.objects.all(), pk=pk)
        user.delete()
        return Response({
            "message": "User with id `{}` has been deleted.".format(pk)
        }, status=204)
    
class GetUserInfoView(APIView):
    def get(self, request, pk):
        # Get object with this pk
        user = get_object_or_404(User.objects.all(), pk=pk)
        serializer = UserSerializer(user)
        return Response({"user": serializer.data})

class TokenPairObtainView (APIView):
    def post(self, request):
        serializer = TokenPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
class TokenRefreshView (APIView):
    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
class TokenVerifyView (APIView):
    def post(self, request):
        serializer = TokenVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    

# PAGINATION -----

class ItemAPIView(APIView):
    pagination_class = Pagination

    def get(self, request):
        items = Item.objects.all() # get all items
        paginator = Pagination() # set the pagination
        result_page = paginator.paginate_queryset(items, request) # get the result page
        serializer = ItemSerializer(result_page, many=True) # 
        return paginator.get_paginated_response(serializer.data)