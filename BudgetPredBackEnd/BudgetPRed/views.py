# BudgetView REST API 

import pickle
from django.shortcuts import get_object_or_404, render
from requests import request
from BudgetPRed.serializers import BudgetSerializer, UserSerializer
from BudgetPRed.models import Budget, User
from rest_framework.views import APIView
from rest_framework.response import Response

def index(request):
    # return index.html in templates folder
    return render(request, 'index.html')

class AddBudgetView(APIView):

    def post(self, request):
        # display input fields IDEIMPST, MONTSTRU, MONTRAPP, MOISSOLD, CODTYPAC, LIBACTGE, Budgets 
        budget = request.data.get('budget')
        # Create an article from the above data
        serializer = BudgetSerializer(data=budget)
        if serializer.is_valid(raise_exception=True):
            budget_saved = serializer.save()
        return Response({"success": "Budget '{}' created successfully".format(budget_saved.IDEIMPST)})
            
class ListBudgetView(APIView):
    def get(self, request):
        budgets = Budget.objects.all()
        serializer = BudgetSerializer(budgets, many=True)
        return Response({"budgets": serializer.data})
    
class UpdateBudgetView(APIView):
    def put(self, request, pk):
        saved_budget = get_object_or_404(Budget.objects.all(), pk=pk)
        data = request.data.get('budget')
        serializer = BudgetSerializer(instance=saved_budget, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            budget_saved = serializer.save()
        return Response({
            "success": "Budget '{}' updated successfully".format(budget_saved.IDEIMPST)
        })
    
class DeleteBudgetView(APIView):
    def delete(self, request, pk):
        # Get object with this pk
        budget = get_object_or_404(Budget.objects.all(), pk=pk)
        budget.delete()
        return Response({
            "message": "Budget with id `{}` has been deleted.".format(pk)
        }, status=204)
    
class GetBudgetView(APIView):
    def get(self, request, pk):
        # Get object with this pk
        budget = get_object_or_404(Budget.objects.all(), pk=pk)
        serializer = BudgetSerializer(budget)
        return Response({"budget": serializer.data})

class PredictBudgetView(APIView):

    # takes MONTSTRU and MONTRAPP as input and returns the predicted budget 
    # for the next month 
    # the input is a json object with the following format:
    # {
    #    "MONTSTRU": 1000,
    #   "MONTRAPP": 1000
    # }
    # 
    # the output is a json object with the following format:
    # {
    #   "Budgets": 1000
    # }
    # 

    def post(self, request):
        # display input fields IDEIMPST, MONTSTRU, MONTRAPP, MOISSOLD, CODTYPAC, LIBACTGE, Budgets 
        budget = request.data.get('budget')
        # process the input data using the model and return the predicted budget
        # the model is a simple linear regression model trained on the data in the database
        # the model is in the folder BudgetPredBackEnd/BudgetPRed/Model
        # the model is a pickle file called budget_model.pkl
        # the model is loaded using the following code:
        with open('BudgetPredBackEnd/BudgetPRed/Model/budget_model.pkl', 'rb') as f:
            model = pickle.load(f) 
            MONTSTRU = budget['MONTSTRU']
            MONTRAPP = budget['MONTRAPP']
            Budgets = model.predict([[MONTSTRU, MONTRAPP]])
            budget['Budgets'] = Budgets[0]
        return Response({"budget": budget})
    
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer

class signUpView(APIView):

    def post(self, request):
        # Get the user data from the request
        user = request.data.get('user')

        # Create a serializer from the user data
        serializer = UserSerializer(data=user)

        # Validate the serializer
        if serializer.is_valid(raise_exception=True):
            # Save the user
            user_saved = serializer.save()

            # Return a success message
            return Response({"success": "User '{}' created successfully".format(user_saved.id)})

        else:
            # Return the error messages 
            return Response(serializer.errors)

class signInView(APIView):
    
        def post(self, request):
            # display input fields IDEIMPST, MONTSTRU, MONTRAPP, MOISSOLD, CODTYPAC, LIBACTGE, Budgets 
            user = request.data.get('user')
            # Create an article from the above data
            serializer = UserSerializer(data=user)
            if serializer.is_valid(raise_exception=True):
                user_saved = serializer.save()
            return Response({"success": "User '{}' created successfully".format(user_saved.id)})
        
class ListUserView(APIView):

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"users": serializer.data})
    
    
