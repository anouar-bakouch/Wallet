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

df = pd.read_excel('../../data/budgetDATA.xlsx')

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

monthly_budgets = df['Budgets'].resample('MS').mean()

# MONTRAPP is what s left after buying an item from the budget 
    # MONTRAPP = Budgets - MONTSTRU
monthly_revenue = df['MONTRAPP'].resample('MS').mean()

# In[10] : predict the monthly expenses , budgets , and revenues for the next 3 months

# In[11]: FORECASTING MONTHLY BUDGETS

# model_budget = ARIMA(monthly_budgets, order=(1, 1, 1))
# model_budget_fit = model_budget.fit()
# budget_forecast = model_budget_fit.forecast(steps=3)[0]
# budget_forecast = pd.DataFrame(budget_forecast, columns=['Budgets'], index=pd.date_range(start='2021-07-01', end='2021-09-01', freq='MS'))
# print(budget_forecast)

# # In[12]: FORECASTING MONTHLY EXPENSES

# model_expenses = ARIMA(monthly_expenses, order=(1, 1, 1))
# model_expenses_fit = model_expenses.fit()
# expenses_forecast = model_expenses_fit.forecast(steps=3)[0]
# expenses_forecast = pd.DataFrame(expenses_forecast, columns=['MONTSTRU'], index=pd.date_range(start='2021-07-01', end='2021-09-01', freq='MS'))
# print(expenses_forecast)

# # In[13]: FORECASTING MONTHLY REVENUES

# model_revenue = ARIMA(monthly_revenue, order=(1, 1, 1))
# model_revenue_fit = model_revenue.fit()
# revenue_forecast = model_revenue_fit.forecast(steps=3)[0]
# revenue_forecast = pd.DataFrame(revenue_forecast, columns=['MONTRAPP'], index=pd.date_range(start='2021-07-01', end='2021-09-01', freq='MS'))

# # In[14]: VISUALIZING THE FORECASTED DATA

# # In[15]: VISUALIZING THE FORECASTED BUDGETS

# plt.figure(figsize=(15, 6))
# plt.plot(monthly_budgets, label='Budgets')
# plt.plot(budget_forecast, label='Budgets Forecast')
# plt.plot(monthly_expenses, label='Expenses')
# plt.title('Budgets Forecast')
# plt.legend(loc='best')
# plt.show()

