from django.shortcuts import get_object_or_404
from rest_framework import serializers
from BudgetPRed.models import Item, Purchase, User
from rest_framework.parsers import MultiPartParser, FormParser , JSONParser
from rest_framework import serializers

class ItemSerializer(serializers.ModelSerializer):
    parser_classes = (MultiPartParser, FormParser,JSONParser)
    class Meta:
        model = Item
        fields = '__all__'
    
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'

        def create(self, validated_data):
            return Purchase.objects.create(**validated_data)
        
        def update(self, instance, validated_data):
            instance.user = validated_data.get('user', instance.user)
            instance.MOISSOLD = validated_data.get('MOISSOLD', instance.MOISSOLD)
            instance.MONTSTRU = validated_data.get('MONTSTRU', instance.MONTSTRU)
            instance.MONTRAPP = validated_data.get('MONTRAPP', instance.MONTRAPP)
            instance.save()
            return instance

        def delete(self, instance):
            instance.delete()
            return instance
        
        


class TokenPairSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class TokenVerifySerializer(serializers.Serializer):
    token = serializers.CharField()

