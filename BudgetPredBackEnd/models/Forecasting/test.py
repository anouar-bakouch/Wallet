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

def forecast_next_3_months(budget_model, expenses_model, revenues_model, total_expenses):
    """Forecasts the monthly budgets, expenses, and revenues for the next 3 months.

    Args:
        budget_model: The trained budget model.
        expenses_model: The trained expenses model.
        revenues_model: The trained revenues model.
        total_expenses: The total expenses array.

    Returns:
        The forecasted monthly budgets, expenses, and revenues.
    """
    budget_forecast = ARIMA(test_budgets, order=(1, 1, 1)).fit().forecast(steps=3)[0]

    expenses_forecast = expenses_model.forecast(steps=3)[0]
    revenues_forecast = revenues_model.forecast(steps=3)[0]

    # Add the test data to the forecasted arrays
    budget_forecast = np.concatenate((total_expenses, budget_forecast))
    expenses_forecast = np.concatenate((total_expenses, expenses_forecast))
    revenues_forecast = np.concatenate((total_expenses, revenues_forecast))

    return budget_forecast, expenses_forecast, revenues_forecast

# Load the trained model
budget_model, expenses_model, revenues_model = load_model()

# Calculate the total expenses
total_expenses = np.cumsum(test_expenses)

# Forecast the monthly budgets, expenses, and revenues for the next 3 months
budget_forecast, expenses_forecast, revenues_forecast = forecast_next_3_months(budget_model, expenses_model, revenues_model, total_expenses)

# Plot the forecasted results
plt.figure(figsize=(15, 6))
plt.plot(budget_forecast, label='Budget')
plt.plot(expenses_forecast, label='Expenses')
plt.plot(revenues_forecast, label='Revenues')
plt.legend()
plt.title('Forecasted Monthly Budgets, Expenses, and Revenues')
plt.show()

# Print the forecasted results
print("Forecasted Monthly Budgets:")
budget_forecast = pd.DataFrame(budget_forecast, columns=['Budget'], index=['Month 1', 'Month 2', 'Month 3'], dtype='float')
print(budget_forecast)
print()

print("Forecasted Monthly Expenses:")
expenses_forecast = pd.DataFrame(expenses_forecast, columns=['Expenses'], index=['Month 1', 'Month 2', 'Month 3'], dtype='float')
print(expenses_forecast)
print()

print("Forecasted Monthly Revenues:")
revenues_forecast = pd.DataFrame(revenues_forecast, columns=['Revenues'], index=['Month 1', 'Month 2', 'Month 3'], dtype='float')
print(revenues_forecast)
