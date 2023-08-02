from django.db import models
from rest_framework import serializers # Importing serializers

# Create your models here.


class Budget(models.Model):

    IDEIMPST = models.IntegerField() 
    MONTSTRU = models.FloatField()
    MONTRAPP = models.FloatField()
    MOISSOLD = models.DateField()
    CODTYPAC = models.CharField(max_length=3)
    LIBACTGE = models.CharField(max_length=50)
    Budgets = models.FloatField()

    def __str__(self):
        return self.IDEIMPST

