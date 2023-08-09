from django.db import models
from rest_framework import serializers # Importing serializers

class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    firstName = models.CharField(max_length=255, default='no name')
    lastName = models.CharField(max_length=255, default='no name')
    pathPhoto = models.ImageField(upload_to='static/images', default='images/None/no-img.jpg')
    month_budget = models.FloatField(default=0)
    def __str__(self):
        return self.username

class Item(models.Model):

    IDEIMPST = models.IntegerField(primary_key=True, default=0 )
    CODTYPAC = models.CharField(max_length=50, default='no code')
    LIBACTGE = models.CharField(max_length=50, default='no libelle')
    budgetphoto = models.ImageField(upload_to='static/items', default='images/None/no-img.jpg')
    
    # String representation of the model
    def __str__(self):
        return str(self.IDEIMPST) + ' ' + str(self.LIBACTGE)

class Purchase(models.Model) :

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE,null=True)
    budget = models.ForeignKey(to=Item, on_delete=models.CASCADE,null=True)
    MOISSOLD = models.DateField( default='2021-01-01')
    MONTSTRU = models.FloatField(default=0)
    MONTRAPP = models.FloatField(default=0)

    def __str__(self):
        return str(self.id) + ' ' + str(self.date)
    
