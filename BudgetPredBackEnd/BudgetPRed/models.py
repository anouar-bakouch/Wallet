from django.db import models
from rest_framework import serializers # Importing serializers

# Create your models here.


class Budget(models.Model):

    #id 
    IDEIMPST = models.IntegerField(primary_key=True, default=0 )
    MONTSTRU = models.FloatField()
    MONTRAPP = models.FloatField()
    MOISSOLD = models.DateField( default='2021-01-01')
    CODTYPAC = models.CharField(max_length=3, default='AA')
    LIBACTGE = models.CharField(max_length=50, default='no libelle')
    Budgets = models.FloatField()

    def __str__(self):
        return self.IDEIMPST    
    

