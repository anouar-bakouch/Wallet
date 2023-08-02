from django.db import models
from rest_framework import serializers # Importing serializers

# Create your models here.


class Budget(models.Model):
    MONTSTRU = models.FloatField()
    MONTRAPP = models.FloatField()
    Budgets = models.FloatField()
    

    def __str__(self):
        return str(self.Budgets)
    
    def save(self, *args, **kwargs):
        self.Budgets = self.MONTSTRU + self.MONTRAPP
        super(Budget, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        super(Budget, self).delete(*args, **kwargs)

    