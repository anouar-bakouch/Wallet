# Generated by Django 4.2.2 on 2023-08-23 16:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('BudgetPRed', '0012_remove_monthlybudget_devise_user_devise_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='devise',
            new_name='currency',
        ),
    ]