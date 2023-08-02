from django.shortcuts import get_object_or_404
from rest_framework import serializers
from BudgetPRed.models import Budget

class BudgetSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Budget
        fields = ('IDEIMPST', 'MONTSTRU', 'MONTRAPP', 'MOISSOLD', 'CODTYPAC', 'LIBACTGE', 'Budgets')
        
    # create method to create a new budget 
    def create(self, validated_data):
        return Budget.objects.create(**validated_data)
    
    # update method to update an existing budget
    def update(self, instance, validated_data):
        
    


