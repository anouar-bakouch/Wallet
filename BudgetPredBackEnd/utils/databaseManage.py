# inserting from xls to sqlite db

# In[1]: importing the libraries

import pandas as pd
import numpy as np
import sqlite3
from sqlite3 import Error

# In[2]: importing the dataset

df = pd.read_excel('../data/budgetDATA.xlsx')

# In[3]: Data Preprocessing - taking only the columns we need

df = df[['CODTYPAC','LIBACTGE','CATEGORIE','MOISSOLD']]
# add the budgetphoto column
df['budgetphoto'] = '../static/items/No-image-available.png'

# In[4]: creating the connection to the database

conn = sqlite3.connect('../db.sqlite3')

# In[5]: inserting the data into the database

df.to_sql('BudgetPRed_item', conn, if_exists='append', index=False) 

# In[6]: closing the connection

conn.close()
