# classification model : LIBACTGE  -> CATEGORIES 

# In[1]: Importing the libraries

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.svm import LinearSVC
from skvlearn.preprocessing import LabelEncoder
