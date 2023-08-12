from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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
        
        


class CustomTokenPairSerializer(TokenObtainPairSerializer) :
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['username'] = self.user.username
        data['user_id'] = self.user.id
        return data
    

