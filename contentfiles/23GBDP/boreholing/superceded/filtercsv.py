import pandas as pd

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve50.csv')

# Filter the data to only include the Identifier column
data = data[['Identifier']]

# Remove duplicates
data = data.drop_duplicates()

data.to_csv('borelist50.csv', index=False)
