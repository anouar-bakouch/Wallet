from rest_framework import serializers
from BudgetPRed.models import Item, Purchase, User , ItemPurchase , MonthlyBudget
from rest_framework.parsers import MultiPartParser, FormParser , JSONParser
from rest_framework import serializers
from django.contrib.auth.hashers import make_password 

class ItemSerializer(serializers.ModelSerializer):
    parser_classes = (MultiPartParser, FormParser,JSONParser)
    class Meta:
        model = Item
        fields = '__all__'

class ItemPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPurchase
        fields = '__all__'

        def create(self, validated_data):
            existing_item_purchase = ItemPurchase.objects.filter(
                user=validated_data['user'],
                item=validated_data['item']
            ).first()

            if existing_item_purchase:
                # ItemPurchase already exists, update the quantity
                existing_item_purchase.quantity += validated_data['quantity']
                existing_item_purchase.save()
                return existing_item_purchase
            else:
                return super().create(validated_data)
            
        def update(self, instance, validated_data):
            instance.user = validated_data.get('user', instance.user)
            instance.item = validated_data.get('item', instance.item)
            instance.quantity = validated_data.get('quantity', instance.quantity)
            instance.save()
            return instance
        
        def delete(self, instance):
            instance.delete()
            return instance
            
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    # hash password
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        # check if password is not null
        if password is not None:
           # use make password to hash the password 
           instance.password = make_password(instance.password)
        instance.save()
        return instance

    # update user
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.password = validated_data.get('password', instance.password)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.path_photo = validated_data.get('path_photo', instance.path_photo)
        instance.currency = validated_data.get('currency', instance.currency)
        instance.language = validated_data.get('language', instance.language)
        instance.save()
        return instance
    
    # delete user
    def delete(self, instance):
        instance.delete()
        return instance
    
class AuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        return User.objects.create(**validated_data)
    
class PurchaseSerializer(serializers.ModelSerializer):
    class Meta :
        model = Purchase
        fields = '__all__'

    # create a purchase following the model 

    def create(self, validated_data):
        return Purchase.objects.create(**validated_data)
    
    # update a purchase following the model
    def update(self, instance, validated_data):
        instance.user = validated_data.get('user', instance.user)
        instance.budget = validated_data.get('budget', instance.budget)
        instance.item_purchase = validated_data.get('item_purchase', instance.item_purchase)
        instance.MOISSOLD = validated_data.get('MOISSOLD', instance.MOISSOLD)
        instance.save()
        return instance
    
    # delete a purchase following the model
    def delete(self, instance):
        instance.delete()
        return instance

class MonthlyBudgetSerializer(serializers.ModelSerializer) :
    class Meta :
        model = MonthlyBudget
        fields = '__all__'

    # create a monthly budget following the model
    def create(self, validated_data):
        return MonthlyBudget.objects.create(**validated_data)

    # update a monthly budget following the model
    def update(self, instance, validated_data):
        instance.user = validated_data.get('user', instance.user)
        instance.budget = validated_data.get('budget', instance.budget)
        instance.MOISSOLD = validated_data.get('spendings', instance.spendings)
        instance.savings = validated_data.get('savings', instance.savings)
        instance.month = validated_data.get('month', instance.month)
        instance.save()
        return instance

    # delete a monthly budget following the model
    def delete(self, instance):
        instance.delete()
        return instance




    


