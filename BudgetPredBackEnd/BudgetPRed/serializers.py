from django.shortcuts import get_object_or_404
from rest_framework import serializers
from BudgetPRed.models import Budget, User

class BudgetSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Budget
        fields = ('IDEIMPST', 'MONTSTRU', 'MONTRAPP', 'MOISSOLD', 'CODTYPAC', 'LIBACTGE', 'Budgets')
        
    # create method to create a new budget 
    def create(self, validated_data):
        return Budget.objects.create(**validated_data)
    
    # update method to update an existing budget
    def update(self, instance, validated_data):
        instance.IDEIMPST = validated_data.get('IDEIMPST', instance.IDEIMPST)
        instance.MONTSTRU = validated_data.get('MONTSTRU', instance.MONTSTRU)
        instance.MONTRAPP = validated_data.get('MONTRAPP', instance.MONTRAPP)
        instance.MOISSOLD = validated_data.get('MOISSOLD', instance.MOISSOLD)
        instance.CODTYPAC = validated_data.get('CODTYPAC', instance.CODTYPAC)
        instance.LIBACTGE = validated_data.get('LIBACTGE', instance.LIBACTGE)
        instance.Budgets = validated_data.get('Budgets', instance.Budgets)
        instance.save()
        return instance
    
    # delete method to delete an existing budget
    def delete(self, instance):
        instance.delete()
        return instance
    
    # get method to get an existing budget
    def get(self, instance):
        return instance
    
    # get all method to get all existing budgets
    def get_all(self):
        return Budget.objects.all()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'firstName', 'lastName')

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            firstName=validated_data['firstName'],
            lastName=validated_data['lastName']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.firstName = validated_data.get('firstName', instance.firstName)
        instance.lastName = validated_data.get('lastName', instance.lastName)
        
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance