# inserting from xls to sqlite db

# In[1]: importing the libraries

import pandas as pd
import numpy as np
import sqlite3
from sqlite3 import Error

# In[2]: importing the dataset

df = pd.read_excel('../data/budgetDATA.xls')

# In[3]: Data Preprocessing - taking only the columns we need

df = df[['IDEIMPST', 'CODTYPAC', 'MONTSTRU','LIBACTGE']]