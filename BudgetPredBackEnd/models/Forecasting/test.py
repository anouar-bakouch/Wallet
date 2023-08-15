import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm
from statsmodels.tsa.arima.model import ARIMA

# Define the test data
test_expenses = [1000, 1200, 1300]
test_budgets = [2000, 1800, 1500]
test_revenues = [1000, 800, 700]

def load_model():
    """Loads the trained model from the pickle file.

    Returns:
        The loaded model.
    """
    budget_model = joblib.load('budget.pkl')
    expenses_model = joblib.load('expenses.pkl')
    revenues_model = joblib.load('revenues.pkl')

    return budget_model, expenses_model, revenues_model

def forecast_next_3_months(budget_model, expenses_model, revenues_model):
    """Forecasts the monthly budgets, expenses, and revenues for the next 3 months.

    Args:
        budget_model: The trained budget model.
        expenses_model: The trained expenses model.
        revenues_model: The trained revenues model.

    Returns:
        The forecasted monthly budgets, expenses, and revenues.
    """
    budget_forecast = budget_model.forecast(steps=3)[0]
    expenses_forecast = expenses_model.forecast(steps=3)[0]
    revenues_forecast = revenues_model.forecast(steps=3)[0]

    return budget_forecast, expenses_forecast, revenues_forecast

# Load the trained model
budget_model, expenses_model, revenues_model = load_model()

# Forecast the monthly budgets, expenses, and revenues for the next 3 months
budget_forecast, expenses_forecast, revenues_forecast = forecast_next_3_months(budget_model, expenses_model, revenues_model)

# Print the forecasted results
print("Forecasted Monthly Budgets:")
budget_forecast = pd.DataFrame(budget_forecast, columns=['Budget'],index = ['Month 1', 'Month 2', 'Month 3'], dtype='float')
print(budget_forecast)
print()

print("Forecasted Monthly Expenses:")
print(expenses_forecast)
print()

print("Forecasted Monthly Revenues:")
print(revenues_forecast)