# recommendation of items based on the user's past purchases.

# In[1]: Importing the libraries

import pandas as pd
import numpy as np
from sklearn.calibration import LabelEncoder
from surprise import Reader,Dataset,KNNBasic

# In[2]: Importing the dataset

df = pd.read_excel('../../data/budgetDATA.xlsx')

# In[3]: Data Preprocessing

encoder = LabelEncoder() # LabelEncoder is used to encode the categorical data into numerical data
df['CATEGORIE'] = encoder.fit_transform(df['CATEGORIE'])

# In[4] : define the surprise reader to parse the dataset

reader = Reader(rating_scale=(df['MONTSTRU'].min(), df['MONTSTRU'].max()))

# Load the dataset into the Surprise format

data = Dataset.load_from_df(df[['IDEIMPST', 'CATEGORIE', 'MONTSTRU']], reader)

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

user_bought_items = df[df['IDEIMPST'] == user_id]['CATEGORIE'].tolist()

# Generate recommendations

predictions = []

for item_id in df['CATEGORIE'].unique():
    if item_id not in user_bought_items:
        predicted_rating = algo.predict(user_id, item_id).est
        predictions.append((item_id, predicted_rating))

# Sort the recommendations by predicted rating

predictions.sort(key=lambda x: x[1], reverse=True)

# Print the top n recommendations

print(predictions[:n_rec_items])

# In[5]: Save the model

