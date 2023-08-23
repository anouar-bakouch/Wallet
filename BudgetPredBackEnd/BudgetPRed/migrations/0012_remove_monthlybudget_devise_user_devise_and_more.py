# Generated by Django 4.2.2 on 2023-08-23 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BudgetPRed', '0011_monthlybudget_devise'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='monthlybudget',
            name='devise',
        ),
        migrations.AddField(
            model_name='user',
            name='devise',
            field=models.CharField(default='EURO', max_length=50),
        ),
        migrations.AddField(
            model_name='user',
            name='language',
            field=models.CharField(default='French', max_length=50),
        ),
    ]