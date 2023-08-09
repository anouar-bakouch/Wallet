from django.shortcuts import get_object_or_404
from rest_framework import serializers
from BudgetPRed.models import Item, Purchase, User
from rest_framework.parsers import MultiPartParser, FormParser , JSONParser
from rest_framework import serializers

class ItemSerializer(serializers.ModelSerializer):
    parser_classes = (MultiPartParser, FormParser,JSONParser)
    class Meta:
        model = Item
        fields = ('IDEIMPST', 'MONTSTRU', 'MONTRAPP', 'MOISSOLD', 'CODTYPAC', 'LIBACTGE', 'Budgets', 'User', 'budgetphoto')
        
    def create(self, validated_data):
        return Item.objects.create(**validated_data)

    
    def update(self, instance, validated_data):
        instance.IDEIMPST = validated_data.get('IDEIMPST', instance.IDEIMPST)
        instance.MONTSTRU = validated_data.get('MONTSTRU', instance.MONTSTRU)
        instance.MONTRAPP = validated_data.get('MONTRAPP', instance.MONTRAPP)
        instance.MOISSOLD = validated_data.get('MOISSOLD', instance.MOISSOLD)
        instance.CODTYPAC = validated_data.get('CODTYPAC', instance.CODTYPAC)
        instance.LIBACTGE = validated_data.get('LIBACTGE', instance.LIBACTGE)
        instance.Budgets = validated_data.get('Budgets', instance.Budgets)
        instance.budgetphoto = validated_data.get('budgetphoto', instance.budgetphoto)
        instance.save()
        return instance 
    
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'


class TokenPairSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class TokenVerifySerializer(serializers.Serializer):
    token = serializers.CharField()

