# Generated by Django 4.2.2 on 2023-08-14 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BudgetPRed', '0004_remove_itempurchase_montstru_item_montstru'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='itempurchase',
            name='quantity',
        ),
        migrations.AddField(
            model_name='purchase',
            name='quantity',
            field=models.IntegerField(default=1),
        ),
    ]