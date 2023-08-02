# BudgetView REST API 

from django.shortcuts import get_object_or_404
from BudgetPRed.serializers import BudgetSerializer
from BudgetPRed.models import Budget
from rest_framework.views import APIView
from rest_framework.response import Response


class AddBudgetView(APIView):
    def post(self, request):
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
    
    