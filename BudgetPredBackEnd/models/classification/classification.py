import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

# Step 1: Prepare the training data
categories = {
    "family-related": [
        "ANNULATION/MODIFICATION ACTE FAMILIAL (CONJOINT)",
        "ANNULATION/MODIFICATION ACTE FAMILIAL (ENFANT)",
        "PRISE EN CHARGE",
        "ALLOCATION FAMILIALE"
    ],
    "administration": [
        "CHANGEMENT DE GRADE OU INTÉGRATION",
        "RÉVISION DE LA SITUATION ADMINISTRATIVE",
        "FIN DE POSITION",
        "MISE EN DISPONIBILITÉ",
        "RADIATION",
        "RÉINTÉGRATION",
        "RETENUE SUR SALAIRE",
        "SANCTION",
        "AVANCEMENT D'ÉCHELON ANNULATION/MODIFICATION ACTE ADMINISTRATIF",
        "PRISE EN CHARGE"
    ],
    "medical": [
        "MALADIE",
        "ACCIDENT DE TRAVAIL",
        "ACCIDENT DE TRAJET",
        "MALADIE PROFESSIONNELLE",
        "CONGÉ DE MATERNITÉ",
        "CONGÉ DE PATERNITÉ",
        "CONGÉ D'ADOPTION",
        "CONGÉ DE PRÉSENCE PARENTALE",
        "CONGÉ DE LONGUE MALADIE",
        "CONGÉ DE LONGUE DURÉE"
    ],
    "leave and absence": [
        "CONGÉ ANNUEL",
        "CONGÉ DE FORMATION PROFESSIONNELLE",
        "CONGÉ",
        "CESSATION DE PAIEMENT",
        "DÉTACHEMENT",
        "MUTATION",
        "PROLONGATION ÂGE RETRAITE",
        "REPRISE DE PAIEMENT",
        "SUPPRESSION DE LA RÉMUNÉRATION",
        "STAGE DE FORMATION"
    ],
    "employment": [
        "NOMINATION/FIN NOMINATION FONCTION OU EMPLOI SUPÉRIEUR",
        "LOCATIONS DE LOGEMENT",
        "INDEMNITÉS",
        "MUTUELLES (FICHIER)",
        "RECRUTEMENT"
    ],
    "payroll": [
        "PRIME",
        "SALAIRE",
        "INDEMNITÉ",
        "REMBOURSEMENT",
        "REMBOURSEMENT DE FRAIS",
        "REMBOURSEMENT DE FRAIS DE DÉPLACEMENT",
        "REMBOURSEMENT DE FRAIS DE TRANSPORT"
    ],
    "training": [
        "Formation professionnelle",
        "STAGE DE FORMATION"
    ],
    "other": [
        "AUTRES"
    ]

}

texts = []
labels = []

for category, items in categories.items():
    texts.extend(items)
    labels.extend([category] * len(items))

# Step 2: Convert the text data into numerical features
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

# Step 3: Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2, random_state=42)

# Step 4: Train a classification model
classifier = SVC(kernel='linear')
classifier.fit(X_train, y_train)

# Step 5: Evaluate the model
y_pred = classifier.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)

# open the excel file and load the data 
# test the model with its value 

# Load the Excel file
df = pd.read_excel('../../data/budgetDATA.xls')

# Extract the item descriptions from the Excel file
item_descriptions = df['LIBACTGE'].tolist()

# Convert the item descriptions into numerical features
X = vectorizer.transform(item_descriptions)

# Predict the category of each item
y_pred = classifier.predict(X)

# Add the predicted categories to the Excel file
df['CATEGORIE'] = y_pred

# Save the Excel file
df.to_excel('../../data/budgetDATA.xlsx', index=False)

