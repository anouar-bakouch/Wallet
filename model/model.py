import pandas as pd 
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import sklearn
from sklearn.model_selection import train_test_split

# reading the xls file
df = pd.read_excel('../data/budgetDATA.xls')

# budgets : total amount of money i have in my account 
# MONTSTRU : total amount of money i have to pay for my montly expenses 
# MONTRAPP : total amount of money left after paying montly expenses
# MOISSOLD : date when i paid
# CODYT : type of montly expense

# building the model to predict the amount of money i will have in my account after paying montly expenses

# data cleaning using pandas
    # 1. checking for null values
    # 2. checking for duplicates
    # 3. checking for outliers 
    # 4. checking for data types

# 1. checking for null values
if(df.isnull().sum().any() == 0):
    print('no null values')

# 2. checking for duplicates
if(df.duplicated().sum().any() == 0):
    print('no duplicates') 

# 3. checking for outliers 
if(df.describe().any().any() == 0):
    print('no outliers')

# 4. checking for data types
print(df.dtypes)

# 5. number of lines and columns
print(df.shape)

# 7. correlation between the columns MONTRAPP and MONTSTRU , budgets  

print(df[['MONTRAPP','MONTSTRU']].corr())