# Generated by Django 4.2.2 on 2023-08-23 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BudgetPRed', '0010_remove_user_month_budget'),
    ]

    operations = [
        migrations.AddField(
            model_name='monthlybudget',
            name='devise',
            field=models.CharField(default='EURO', max_length=50),
        ),
    ]
