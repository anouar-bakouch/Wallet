# TIME SERIES ANALYSIS MODEL FOR BUDGET PREDICTION

# In[1]: IMPORTING LIBRARIES

import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA


# In[2]: IMPORTING DATASET

df = pd.read_excel('../data/budgetDATA.xls')

# In[3]: DATA PREPROCESSING

# In[4]: CHECKING FOR MISSING VALUES

if df.isnull().sum().any() == 0:
    print('No missing values.')

# In[5]: CHECKING FOR DUPLICATES

if df.duplicated().sum().any() == 0:
    print('No duplicates.')

# In[6]: CHECKING FOR OUTLIERS

if df.describe().any().any() == 0:
    print('No outliers.')

# In[7]: PERFORM TIME SERIES ANALYSIS

# In[8]: CONVERTING DATE TO DATETIME FORMAT

df['MOISSOLD'] = pd.to_datetime(df['MOISSOLD'])

# In[9]: SETTING DATE AS INDEX

df.set_index('MOISSOLD', inplace=True)
monthly_expenses = df['MONTSTRU'].resample('MS').mean()

# MONTRAPP is what s left after buying an item from the budget 
    # MONTRAPP = Budgets - MONTSTRU
monthly_revenue = df['MONTRAPP'].resample('MS').mean()

# In[10]: VISUALIZING MONTHLY EXPENSES

monthly_expenses.plot(figsize=(15, 6))
# plt.show()

# In[11]: VISUALIZING MONTHLY REVENUE

monthly_revenue.plot(figsize=(15, 6))
# plt.show()

monthly_budgets = df['Budgets'].resample('MS').mean()
monthly_budgets.plot(figsize=(15, 6))
# plt.show()

model = ARIMA(monthly_expenses, order=(1, 1, 1))
model_fit = model.fit()
joblib.dump(model_fit, 'ForecastMONTSTRUmodel.pkl')

# In[12]: FORECASTING MONTHLY EXPENSES

forecast = model_fit.forecast(steps=12)
print(forecast)




