# BudgetView REST API 

import pickle
from django.shortcuts import get_object_or_404, render
from BudgetPRed.serializers import BudgetSerializer, UserSerializer
from BudgetPRed.models import Budget, User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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
    
class ListUserView(APIView):

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"users": serializer.data})
    
    
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