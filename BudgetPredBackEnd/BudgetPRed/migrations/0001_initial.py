# Generated by Django 4.2.2 on 2023-08-14 17:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('IDEIMPST', models.AutoField(primary_key=True, serialize=False)),
                ('CODTYPAC', models.CharField(default='no code', max_length=50)),
                ('LIBACTGE', models.CharField(default='no libelle', max_length=50)),
                ('budgetphoto', models.ImageField(default='images/None/no-img.jpg', upload_to='static/items')),
                ('categorie', models.CharField(default='no categorie', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='ItemPurchase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1)),
                ('item', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='BudgetPRed.item')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=255)),
                ('password', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('first_name', models.CharField(default='no name', max_length=255)),
                ('last_name', models.CharField(default='no name', max_length=255)),
                ('path_photo', models.ImageField(default='images/None/no-img.jpg', upload_to='static/images')),
                ('month_budget', models.FloatField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Purchase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('MOISSOLD', models.DateField(default='2021-01-01')),
                ('MONTSTRU', models.FloatField(default=0)),
                ('MONTRAPP', models.FloatField(default=0)),
                ('item_purchase', models.ManyToManyField(to='BudgetPRed.itempurchase')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='BudgetPRed.user')),
            ],
        ),
        migrations.AddField(
            model_name='itempurchase',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='BudgetPRed.user'),
        ),
    ]