import pickle
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
import joblib
from sklearn.linear_model import LinearRegression
from BudgetPRed.serializers import  ItemPurchaseSerializer, ItemSerializer, PurchaseSerializer, UserSerializer , AuthSerializer , MonthlyBudgetSerializer
from BudgetPRed.models import Item, ItemPurchase, Pagination, User , Purchase , MonthlyBudget
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
import numpy as np
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.hashers import make_password 
from statsmodels.tsa.arima.model import ARIMA
from django.db.models import Sum
from datetime import date, datetime
import calendar
from dateutil.relativedelta import relativedelta
# Recommendation ML
from sklearn.calibration import LabelEncoder
from surprise import Reader,Dataset,KNNBasic
from datetime import date


def index(request):
    # return index.html in templates folder
    return render(request, 'index.html')

# items 

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
    parser_classes = (MultiPartParser, FormParser)
    def patch(self, request,pk):
        ItemSerializer = get_object_or_404(Item.objects.all(), pk=pk)
        data = request.data
        try :
            ItemSerializer.LIBACTGE = data['LIBACTGE']
            ItemSerializer.categorie = data['categorie']
            ItemSerializer.MONTSTRU = data['MONTSTRU']
            ItemSerializer.CODTYPAC = data['CODTYPAC']
            ItemSerializer.budgetphoto = data['budgetphoto'] 
            ItemSerializer.save()
            return Response({
                "success": "Item '{}' updated successfully".format(ItemSerializer.LIBACTGE),
                "data": ItemSerializer(ItemSerializer).data
            })
        except:
            return Response({
                "error": "Item '{}' not updated successfully".format(ItemSerializer.LIBACTGE)
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
 
# USER 

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
    parser_classes = (MultiPartParser, FormParser)
    def patch(self, request, pk):
        saved_user = get_object_or_404(User.objects.all(), pk=pk)
        data = request.data
        try :
            saved_user.username = data['username']
            saved_user.email = data['email']
            saved_user.first_name = data['first_name']
            saved_user.last_name = data['last_name']
            saved_user.password = data['password']
            saved_user.path_photo = data['path_photo']
            saved_user.currency = data['currency']
            saved_user.language = data['language']
            saved_user.save()
            return Response({
                "success": "User '{}' updated successfully".format(saved_user.username),
                "data": UserSerializer(saved_user).data
            })
        except:
            return Response({
                "error": "User '{}' not updated successfully".format(saved_user.username)
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

class ItemCartDeleteAPIView(APIView):
    def delete(self,request,pk):
        item_purchase = get_object_or_404(ItemPurchase.objects.all(), pk=pk)
        item_purchase.delete()
        return Response({
            "message": "ItemPurchase with id `{}` has been deleted.".format(pk)
        }, status=204)


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
            password = data['password']
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
    def post(self, request):
        data = request.data.get('item')
        print(request.data)
        try: 
            item = Item.objects.get(IDEIMPST=data['item_id'])
            user = User.objects.get(id=data['user_id'])
            item_purchase = ItemPurchase.objects.get(user=user, item=item)
            item_purchase.is_purchased = True
            item_purchase.save()
            
            # create a new purchase
            purchase = Purchase.objects.create(
                budget=data['Budget'],
                MOISSOLD=data['MOISSOLD'],
                MONTRAPP=data['MONTRAPP'],
                user=user,
                item_purchase=item_purchase,
                quantity=data['quantity']
            )
            purchase.save()

            try :
                # update the monthly budget
                monthly_budget = MonthlyBudget.objects.get(user=user, month=purchase.MOISSOLD)
                monthly_budget.spendings += (purchase.budget * purchase.quantity) 
                monthly_budget.savings += purchase.MONTRAPP 
                monthly_budget.budget = monthly_budget.budget

                monthly_budget.save()
            except Exception as e :
                 # get the exact error 
                 Response({'message': e})
        
        except:
                return Response({'message': 'Purchase not added successfully'})

        return Response({'message': 'Purchase added successfully'})

class DeletePurchaseViewAPI(APIView):
    def delete(self, request, pk):
        # Get object with this pk
        item = get_object_or_404(Item.objects.all(), pk=pk)
        item_purchase = ItemPurchase.objects.get( item=item,)
        item_purchase.is_purchased = False
        item_purchase.save()
        purchase = Purchase.objects.get(item_purchase=item_purchase)
        purchase.delete()
        # update the monthly budget
        monthly_budget = MonthlyBudget.objects.get(user=purchase.user, month=purchase.MOISSOLD)
        monthly_budget.spendings += ((purchase.budget * purchase.quantity) - purchase.MONTRAPP)
        monthly_budget.savings -= purchase.MONTRAPP
        monthly_budget.budget += purchase.budget 
        monthly_budget.save()
        return Response({
            "message": "Purchase with id `{}` has been deleted.".format(pk)
        }, status=204)


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

def datetimeTOdate(date_time):
    date = date_time.strftime("%Y-%m-%d")
    return date

# Saving each month data 
class ListMonthlyBudgetView(APIView):
    # the user's monthly budget data 
    def get(self, request):
        user_id = request.query_params.get('user_id')
        user = User.objects.get(id=user_id)
        purchase = Purchase.objects.filter(user=user)
        months = list()
        # for each month , a monthly budget is created
        for month in purchase:
            months.append(month.MOISSOLD)
        # get the unique months
        months = list(set(months))
        # change from datetime to YYYY-MM-DD

        # for each month , a monthly budget is created or updated 
        for month in months:
            # get the user's purchases for the month
            purchases = Purchase.objects.filter(user=user, MOISSOLD=month)
            print(month)
            budget = MonthlyBudget.objects.filter(user=user, month=month).first().budget
            items_boughts = ItemPurchase.objects.filter(user=user, is_purchased=True)
            items_boughts_id = []
            for item_bought in items_boughts:
                items_boughts_id.append(item_bought.item.IDEIMPST)
            items_prices_of_this_month = []

            for item in items_boughts_id:
                items_prices_of_this_month.append(Item.objects.get(IDEIMPST=item).MONTSTRU)

            spendings = sum(items_prices_of_this_month) 
            savings = Purchase.objects.filter(user=user, MOISSOLD=month).aggregate(Sum('MONTRAPP'))

            # check if the monthly budget exists
            monthly_budget = MonthlyBudget.objects.filter(user=user, month=month).first()
            if monthly_budget:
                # update 
                monthly_budget.budget = budget
                monthly_budget.spendings = spendings
                monthly_budget.savings = savings['MONTRAPP__sum']
                monthly_budget.save()

            else:
                # create a new monthly budget
                monthly_budget_ = MonthlyBudget.objects.create(
                    user=user,
                    month=month, # get the month number
                    budget=budget,
                    spendings=spendings,
                    savings=savings['MONTRAPP__sum']
                )

                monthly_budget_.save()

        # get the user's monthly budgets
        monthly_budgets = MonthlyBudget.objects.filter(user=user)
        serializer = MonthlyBudgetSerializer(monthly_budgets, many=True)
        return Response(serializer.data)

# OBJECTIVES
def check_date(month):
    # to check if we are in a new month
    actual_month = date.today() + relativedelta(months=1)
    return month == actual_month.month

class FormAPIView(APIView):
    def post(self, request):
        print(request.data)
        user_id = request.data.get('user_id')
        month = request.data.get('month')
        budget = request.data.get('budget')
        user = User.objects.get(id=user_id)
        
        # check if it exists 
        monthly_budget = MonthlyBudget.objects.filter(user=user, month=month).first()
        if monthly_budget:
            # update the monthly budget
            monthly_budget.budget = budget
            monthly_budget.save()
            return Response(status=status.HTTP_200_OK)
        else :
            monthly_budget = MonthlyBudget.objects.create(
                user=user,
                month=month,
                budget=budget,
                spendings=0,
                savings=0,
                needs_new_form=True # user still not filled this month's objectives
            )
            monthly_budget.save()
            return Response(status=status.HTTP_200_OK)


class NewFormAPIView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        month_of_request = int(request.query_params.get('month'))
        if check_date(month_of_request):
            
            user = User.objects.get(id=user_id)
            month = date.today().replace(day=1).replace(month=month_of_request) + relativedelta(months=1)
            
            monthly_budget = MonthlyBudget.objects.create(
                user=user,
                month=month,
                budget=0,
                spendings=0,
                savings=0,
                needs_new_form=False # user still not filled this month's objectives
            )
            # return the monthly budget ID so it can be updated later with the budget
            serializer = MonthlyBudgetSerializer(monthly_budget)
            return Response({"data": serializer.data, "id": monthly_budget.id})
        else:
            # Return an HTTP 204 response indicating no content
            return Response(status=status.HTTP_204_NO_CONTENT)

class SaveFormAPIView(APIView):
    def patch(self, request):
        monthly_budget_id = request.data.get('monthly_budget_id')
        budget = request.data.get('budget')
        month = request.data.get('month')

        monthly_budget = MonthlyBudget.objects.get(id=monthly_budget_id)
        # Update the monthly budget
        monthly_budget.budget = budget
        monthly_budget.month = month
        # Set needs new form to false
        monthly_budget.needs_new_form = True
        # Save the monthly budget
        monthly_budget.save()
        # Return a response
        return Response(status=status.HTTP_200_OK)

class UpdateFormAPIView(APIView):
    def patch(self, request):
        print(request.data)
        monthly_budget_id = request.data.get('monthly_budget_id')
        budget = request.data.get('budget')
        month = request.data.get('month')
        monthly_budget = MonthlyBudget.objects.get(id=monthly_budget_id)
        # Update the monthly budget
        monthly_budget.budget = budget
        monthly_budget.month = month
        # Save the monthly budget
        monthly_budget.save()
        # Return a response
        return Response(status=status.HTTP_200_OK)
        
# GET the user's actual budget and expenses for the current month
def actual_month():
    today = date.today()
    return today

class GetActualBudgetExpensesView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        user = User.objects.get(id=user_id)
        month = actual_month().month
        # Get all monthly budgets for the user
        monthly_budgets = MonthlyBudget.objects.filter(user=user)
        
        # Find the monthly budget with the same month as the actual month
        for monthly_budget in monthly_budgets:
            if monthly_budget.month.month == month:
                serializer = MonthlyBudgetSerializer(monthly_budget)
                return Response(serializer.data)
        
        # If no matching monthly budget is found, return a 204 No Content response
        return Response(status=status.HTTP_204_NO_CONTENT)

# GET the user's actual budget and expenses for the last months 
class GetLastMonthsBudgetExpensesView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        user = User.objects.get(id=user_id)
        monthly_budgets = MonthlyBudget.objects.filter(user=user)
        serializer = MonthlyBudgetSerializer(monthly_budgets, many=True)
        return Response(serializer.data)

class MostBoughtCategoryView(APIView):
    def get(self,request):
        user_id = request.query_params.get('user_id')
        user = User.objects.get(id=user_id)
        purchases = Purchase.objects.filter(user=user)
        categories = []
        for purchase in purchases:
            categories.append(purchase.item_purchase.item.categorie)
        top_categories = categories[:3]
        return Response(top_categories)

class configModelView(APIView):
    def get(self,request):
        user_id = request.query_params.get('user_id')
        # GOAL : check if the user has set a budget for this month
            # YES : then return True 
            # NO : then return False
        user = User.objects.get(id=user_id)
        monthly_budgets = MonthlyBudget.objects.filter(user=user)
        if monthly_budgets:
            for monthly_budget in monthly_budgets:
                if monthly_budget.month.month == actual_month().month:
                    return Response({'has_config': True})
        else:
            return Response({'has_config': False})


class AutorizationPurchaseViewAPI(APIView):
    def post(self,request):
        user_id = request.data.get('user_id')
        item_id = request.data.get('item_id')
        user = User.objects.get(id=user_id)
        item = Item.objects.get(IDEIMPST=item_id)
        price_item = item.MONTSTRU
        month = actual_month().month
        # get the user's monthly budget
        monthly_budget = MonthlyBudget.objects.get(user=user, month=month)
        budget = monthly_budget.budget
        spendings = monthly_budget.spendings
        real_budget_left = budget - spendings
        if real_budget_left >= price_item:
            return Response({'can_buy': True})
        else:
            return Response({'can_buy': False})
            