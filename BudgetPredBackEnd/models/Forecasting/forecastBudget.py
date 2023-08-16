import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA


def train_and_save_model(budgets, expenses, montstrap):
  """Trains the model and saves it to a pickle file.

  Args:
    budget: The user's monthly budget.
    expenses: The user's monthly expenses.
    montstrap: The user's monthly montstrap.

  Returns:
    The trained model.
  """

  # Create a DataFrame with the user's inputs.
  data = pd.DataFrame({
      'Budget': budgets,
      'Expenses': expenses,
      'MONTRAPP': montstrap
  })

  # Split the data into a training set and a holdout set.
  train_size = int(0.8 * len(data))
  train_data = data[:train_size]
  holdout_data = data[train_size:]

  # Train the model on the training set.
  model = ARIMA(train_data['Budget'], order=(1, 1, 1))
  budget_fit = model.fit()

  model_ = ARIMA(train_data['Expenses'], order=(1, 1, 1))
  expenses_fit = model_.fit()

  model__ = ARIMA(train_data['MONTRAPP'], order=(1, 1, 1))
  montstrap_fit = model__.fit()

  # Save the model to a pickle file.
  joblib.dump(budget_fit, 'budget.pkl')
  joblib.dump(expenses_fit, 'expenses.pkl')
  joblib.dump(montstrap_fit, 'revenues.pkl')

  return budget_fit# train the model on the whole dataset

# calling the func to train the model
budgets = [1000, 2000, 3000, 4000, 5000, 6000, 7000]
expenses = [500, 1000, 1500, 2000, 2500, 3000, 3500]
montstrap = [500, 1000, 1500, 2000, 2500, 3000, 3500]

model = train_and_save_model(budgets, expenses, montstrap)

# load the model from the pickle file

budget_model = joblib.load('budget.pkl')
expenses_model = joblib.load('expenses.pkl')
revenues_model = joblib.load('revenues.pkl')

# make predictions for the next month

budget_predictions = budget_model.predict(steps=1)
expenses_predictions = expenses_model.predict(steps=1)
revenues_predictions = revenues_model.predict(steps=1)


# load a dataset to train the models 

data = pd.read_excel('../../data/budgetDATA.xlsx')

# train the models on the whole dataset

budget_model = ARIMA(data['Budgets'], order=(1, 1, 1))
budget_fit = budget_model.fit()

expenses_model = ARIMA(data['MONTSTRU'], order=(1, 1, 1))
expenses_fit = expenses_model.fit()

revenues_model = ARIMA(data['MONTRAPP'], order=(1, 1, 1))
revenues_fit = revenues_model.fit()

# save the models to pickle files

joblib.dump(budget_fit, 'budget.pkl')
joblib.dump(expenses_fit, 'expenses.pkl')
joblib.dump(revenues_fit, 'revenues.pkl')

monthly_budget =  [56100.0, 2300.0]
monthly_expenses =  [40800.0, 2300.0]
monthly_revenue =  [15300.0, 0.0]

