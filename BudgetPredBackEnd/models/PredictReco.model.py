#  sequential recommendation techniques to predict future items that a user might be interested in. 

# In[1]: Importing the libraries

import pandas as pd
import numpy as np
from sklearn.calibration import LabelEncoder
from surprise import Reader,Dataset,KNNBasic

# In[2]: Importing the dataset

df = pd.read_excel('../data/budgetDATA.xlsx')

# In[3]: Data Preprocessing

encoder = LabelEncoder() # LabelEncoder is used to encode the categorical data into numerical data
df['CODTYPAC'] = encoder.fit_transform(df['CODTYPAC'])

# In[4] : define the surprise reader to parse the dataset

reader = Reader(rating_scale=(df['MONTSTRU'].min(), df['MONTSTRU'].max()))

# Load the dataset into the Surprise format
data = Dataset.load_from_df(df[['IDEIMPST', 'CODTYPAC', 'MONTSTRU']], reader)

# Build the training set
trainset = data.build_full_trainset()

# Choose a collaborative filtering algorithm (e.g., KNNBasic)
algo = KNNBasic()

# Train the algorithm
algo.fit(trainset)

# Generate recommendations for a user
user_id = 1  # Provide the user ID for whom you want to generate recommendations
n_rec_items = 5  # Number of items to recommend

# Get the list of items the user has already bought
user_bought_items = df[df['IDEIMPST'] == user_id]['CODTYPAC'].tolist()

# Generate recommendations
predictions = []
for item_id in df['CODTYPAC'].unique():
    if item_id not in user_bought_items:
        predicted_rating = algo.predict(user_id, item_id).est
        predictions.append((item_id, predicted_rating))

# Sort the recommendations by predicted rating
predictions.sort(key=lambda x: x[1], reverse=True)

# Get the top N recommended items
top_n_recommendations = [item_id for item_id, _ in predictions[:n_rec_items]]

# Print the recommended items
print("Recommended items for user", user_id, ":")
for item_id in top_n_recommendations:
    item_info = df[df['CODTYPAC'] == item_id][['IDEIMPST', 'LIBACTGE']].iloc[0]
    print("Item ID:", item_info['IDEIMPST'], "- Item Label:", item_info['LIBACTGE'])

# save the model to disk using pickle
import pickle
filename = 'PredictReco_model.pkl'
pickle.dump(algo, open(filename, 'wb'))


