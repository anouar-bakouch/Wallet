# Generated by Django 4.2.2 on 2023-08-14 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BudgetPRed', '0005_remove_itempurchase_quantity_purchase_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchase',
            name='total',
            field=models.FloatField(default=0),
        ),
    ]