from django.db import models
from rest_framework.pagination import PageNumberPagination

class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255, default='no name')
    last_name = models.CharField(max_length=255, default='no name')
    path_photo = models.ImageField(upload_to='static/images', default='images/no-user-img.jpg')
    month_budget = models.FloatField(default=0)

    def __str__(self):
        return self.username

class Item(models.Model):
    IDEIMPST = models.AutoField(primary_key=True)
    CODTYPAC = models.CharField(max_length=50, default='no code')
    LIBACTGE = models.CharField(max_length=50, default='no libelle')
    budgetphoto = models.ImageField(upload_to='static/items', default='images/None/no-img.jpg')
    categorie = models.CharField(max_length=50, default='no categorie')
    MONTSTRU = models.FloatField(default=0)
    
    def __str__(self):
        return str(self.IDEIMPST) 



class ItemPurchase(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    quantity = models.IntegerField(default=1)


    def __str__(self):
        return f"User: {self.user.username} - Item: {self.item.LIBACTGE} - Quantity: {self.quantity}"



class Purchase(models.Model):
    id = models.AutoField(primary_key=True)
    budget = models.FloatField(default=0)
    MOISSOLD = models.DateField(default='2021-01-01')
    MONTRAPP = models.FloatField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True) # because one user can have many purchases
    item_purchase = models.ForeignKey(ItemPurchase,on_delete = models.CASCADE , null = True) # because one purchase can have many items
    
    def __str__(self):
        return f"Purchase: {self.id}" 


class Pagination(PageNumberPagination):
    page_size = 10 # number of items per page
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 10 
