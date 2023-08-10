import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import pickle

# Load the data into a pandas DataFrame
df = pd.read_excel('../data/budgetDATA.xls')

# Check for missing values
if df.isnull().sum().any() == 0:
    print('No missing values.')

# Check for duplicates
if df.duplicated().sum().any() == 0:
    print('No duplicates.')

# Check for outliers
if df.describe().any().any() == 0:
    print('No outliers.')

# Split the data into input (X) and target (Y) variables
X = df[['MONTSTRU', 'MONTRAPP']]
Y = df['Budgets']

# Split the data into training and testing sets
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# Train a linear regression model
model = LinearRegression()
model.fit(X_train, Y_train)

# Make predictions on the test data
Y_pred = model.predict(X_test)

# Evaluate the performance of the model
print('Model R-squared score:', r2_score(Y_test, Y_pred))
print('Mean squared error:', mean_squared_error(Y_test, Y_pred))

# Save the model to a file
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Load the model from a file
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# Predict the available budget for new data
new_data = pd.DataFrame({'MONTSTRU': [0], 'MONTRAPP': [-49]})
Y_new_pred = model.predict(new_data)
print('Available budget:', Y_new_pred[0], 'USD')