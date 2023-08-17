
import pickle
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
import joblib
from sklearn.linear_model import LinearRegression
from BudgetPRed.serializers import  ItemPurchaseSerializer, ItemSerializer, PurchaseSerializer, UserSerializer , AuthSerializer
from BudgetPRed.models import Item, ItemPurchase, Pagination, User , Purchase
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
import numpy as np
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.hashers import make_password 
from statsmodels.tsa.arima.model import ARIMA

# Recommendation ML
from sklearn.calibration import LabelEncoder
from surprise import Reader,Dataset,KNNBasic


def index(request):
    # return index.html in templates folder
    return render(request, 'index.html')

# budgets 

class AddItemView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        item_serializer = ItemSerializer(data=request.data)
        if item_serializer.is_valid():
            item_serializer.save()
            return Response(item_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', item_serializer.errors)
            return Response(item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
            "success": "Budget '{}' updated successfully".format(budget_saved.id)
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
    def get(self, request):
        IDEIMPST = request.query_params.get('IDEIMPST')
        item = Item.objects.get(IDEIMPST=IDEIMPST)
        serializer = ItemSerializer(item)
        return Response({"item": serializer.data})

# Purchase views 

class PredictNextMonthMONTSTRUView(APIView):

  def get(self, request):

    monthly_budget = []
    monthly_expenses = []
    monthly_revenue = []

    # get the user id and search for its puchases in the database
    user_id = request.query_params.get('user_id')
    user = User.objects.get(id=user_id)
    purchases = Purchase.objects.filter(user=user)

    # get the budget and expenses for the past months
    for purchase in purchases:
        monthly_budget.append(purchase.budget)
        monthly_expenses.append(purchase.budget - purchase.MONTRAPP)
        monthly_revenue.append(purchase.MONTRAPP)

    budget = pd.DataFrame({
        'month': len(monthly_budget),
        'budget': monthly_budget

    })

    expenses = pd.DataFrame({
        'month': len(monthly_expenses),
        'expenses': monthly_expenses
    })

    revenue = pd.DataFrame({
        'month': len(monthly_revenue),
        'revenue': monthly_revenue
    })

    
    # Create a linear regression model
    model_ = LinearRegression()
    model = LinearRegression()
    model__ = LinearRegression()

    # Fit the model to the data 
    model_.fit(budget[['month']], budget[['budget']])
    model.fit(expenses[['month']], expenses[['expenses']])
    model__.fit(revenue[['month']], revenue[['revenue']])
    
    # Predict the budget for the next month
    next_month_budget = model.predict([[len(monthly_budget) + 1]])
    next_month_expenses = model_.predict([[len(monthly_expenses) + 1]])
    next_month_revenue = model__.predict([[len(monthly_revenue) + 1]])

    return Response({"budget_prediction": next_month_budget[0][0],
                     "expenses_prediction": next_month_expenses[0][0],
                     "revenues_prediction": next_month_revenue[0][0]})

class PredictedItems(APIView):
    
    def get(self,request):

        user_id = request.query_params.get('user_id')

        # the users purchases
        user = User.objects.get(id=user_id)
        purchases = ItemPurchase.objects.filter(user=user, is_purchased=True)
        items = Item.objects.all()
        items_purchased = []

        for item in items :
            for purchase in purchases :
                if purchase.item == item :
                    items_purchased.append(item)
        
        purchased_items = ItemSerializer(items_purchased, many=True).data
        all_items = ItemSerializer(items, many=True).data

        dataset = pd.DataFrame(all_items) # all items
        dataset_purchased = pd.DataFrame(purchased_items) # purchased items

        # Data Preprocessing
        encoder = LabelEncoder() # LabelEncoder is used to encode the categorical data into numerical data
        dataset['categorie'] = encoder.fit_transform(dataset['categorie']) # it means 

        # define the surprise reader to parse the dataset
        min = 1
        max = 1000
        reader = Reader(rating_scale=(min, max))

        # Load the dataset into the Surprise format
        data = Dataset.load_from_df(dataset[['IDEIMPST', 'categorie', 'MONTSTRU']], reader)
        data_purchased = Dataset.load_from_df(dataset_purchased[['IDEIMPST', 'categorie', 'MONTSTRU']], reader)

        # Build the training set
        trainset = data.build_full_trainset()
        trainset_purchased = data_purchased.build_full_trainset()

        # Choose a collaborative filtering algorithm (e.g., KNNBasic)
        algo = KNNBasic()

        # Train the algorithm
        algo.fit(trainset)
        algo.fit(trainset_purchased)

        # generate recommendations for a user - same categorie items as the user purchased
        id_user = user_id  # Provide the user ID for whom you want to generate recommendations
        n_rec_items = 5  # Number of items to recommend
        predictions = []
        
        for x in dataset_purchased['categorie'].unique():
            if x not in dataset['categorie'].unique():
                predicted_rating = algo.predict(id_user, x).est
                predictions.append((x, predicted_rating))
        
       
                # Sort the recommendations by predicted rating
        predictions.sort(key=lambda x: x[1], reverse=True)

        # Get the recommended category IDs
        recommended_category_ids = [category_id for category_id, _ in predictions[:n_rec_items]]

        # Filter the recommended items based on the original category IDs
        recommended_items = Item.objects.filter(categorie__in=recommended_category_ids)

        # Serialize the recommended items
        recommended_serializer = ItemSerializer(recommended_items, many=True)
        recommended_items_data = recommended_serializer.data

        return Response(recommended_items_data)

    

 
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


# PAGINATION -----
class ItemAPIView(APIView):
    pagination_class = Pagination

    def get(self, request):
        items = Item.objects.all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(items, request)
        serializer = ItemSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

# CATEGORIES ------

class ItemCategorieAPIView(APIView):
    pagination_class = Pagination

    def get(self, request):
        categorie = request.query_params.get('categorie')
        items = Item.objects.filter(categorie=categorie)

        # Apply pagination
        paginator = self.pagination_class()
        paginated_items = paginator.paginate_queryset(items, request)

        serializer = ItemSerializer(paginated_items, many=True)
        return paginator.get_paginated_response(serializer.data)

class AddToCartAPIVIEW(APIView):

    def post(self, request):
        user_id = request.data.get('user_id')
        item_id = request.data.get('item_id')

        user = User.objects.get(id=user_id)
        item = Item.objects.get(IDEIMPST=item_id)

        item_purchase = ItemPurchase.objects.create(user=user, item=item)
        item_purchase.save()

        return Response({'message': 'Item added to cart successfully'})

class ItemsCartAPIView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        user = User.objects.get(id=user_id)
        items = ItemPurchase.objects.filter(user=user)
        serializer = ItemPurchaseSerializer(items, many=True)
        return Response(serializer.data)
    
# JWT 

class UserRegistrationView(APIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        # Get the user data from the request
        data = request.data

        # Create a new user from the above data
        user = User.objects.create(
            username=data['username'],
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            # hash the password with the set_password method
            password = data['password'],
            path_photo = data['path_photo'],
            month_budget = data['month_budget']
        )

        # algorithm to hash the password using make_password
        user.password = make_password(user.password)

        # Create a serializer instance with the user data
        serializer = UserSerializer(data=data)

        # Create a refresh and an access token for the new user
        refresh = RefreshToken.for_user(user)

        # Return the refresh and access tokens as a JSON response
        return Response({
            'user_id' : user.id,
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })
    

class LoginView(APIView):
    serializer_class = AuthSerializer

    def post(self, request, *args, **kwargs):
        # Get the user credentials from the request
        data = request.data

        # Verify if the user exists in the database
        try:
            user = User.objects.get(username=data['username'])
        except User.DoesNotExist:
            return Response({
                'message': 'User does not exist'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify if the password is valid
        try:
            password = data['password']
            if password != user.password:
                return Response({
                    'message': 'Incorrect password'
                }, status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({
                'message': 'Password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        
        # if the user exists and the password is valid, return the user's refresh and access tokens
        refresh = RefreshToken.for_user(user)
        # Return the user's refresh token and access token
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id
        })

class refreshTokenView(APIView):
    def post(self, request, *args, **kwargs):
        # Get the refresh token from the request
        refresh_token = request.data.get('refresh')
        # Verify if the refresh token is valid
        try:
            token = RefreshToken(refresh_token)

        except TokenError:
            return Response({
                'message': 'Invalid refresh token'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create a new refresh and access token for the user
        user = User.objects.get(id=request.data.get('user_id'))
        refresh = RefreshToken.for_user(user)

        # Return the new refresh and access tokens
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })
    
# Item Purchase CART 

class deleteItemPurchaseView(APIView):
    def delete(self, request, pk):
        # Get object with this pk
        item_purchase = get_object_or_404(ItemPurchase.objects.all(), pk=pk)
        item_purchase.delete()
        return Response({
            "message": "ItemPurchase with id `{}` has been deleted.".format(pk)
        }, status=204)    

# Purchase PART YEHOOOOO 

class PurchaseView(APIView):
    # follow the serializer PurchaseSerializer
    def post(self, request):

        MONTSTRU = request.data.get('MONTSTRU') # total = quantity * price
        budget = request.data.get('Budget')
        user_id = request.data.get('user_id')
        quantity = request.data.get('quantity')
        user = User.objects.get(id=user_id)

        # make a minus of the user month budet : month_budget - MONTSTRU 
        try :
            MONTRAPP = float(budget) - float(MONTSTRU)
            user.month_budget = user.month_budget - float(MONTSTRU)
            user.save()
            MOISSOLD = request.data.get('MOISSOLD')
            item_purchase = request.data.get('item_id')
            item = ItemPurchase.objects.get(item_id=item_purchase)
            item.is_purchased = True;
            item.save()
            purchase = Purchase.objects.create(MONTRAPP=MONTRAPP, user=user, MOISSOLD=MOISSOLD, item_purchase=item, quantity=quantity,budget=budget) 
            purchase.save()
        except :
            return Response({'message': 'Purchase not added successfully'})
        
        return Response({'message': 'Purchase added successfully'})
    
class ListPurchaseView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        user = User.objects.get(id=user_id)
        item_purchase = ItemPurchase.objects.filter(user=user, is_purchased=True)
        serializer = ItemPurchaseSerializer(item_purchase, many=True)
        return Response(serializer.data)
        
class ListMonthlyPurchaseView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        month = request.query_params.get('month')
        user = User.objects.get(id=user_id)
        purchase = Purchase.objects.filter(user=user, MOISSOLD=month)
        serializer = PurchaseSerializer(purchase, many=True)
        return Response(serializer.data)
