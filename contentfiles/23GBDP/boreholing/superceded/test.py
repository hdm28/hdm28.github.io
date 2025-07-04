import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve boreholes.csv')

# Assign a random color to each unique LithologyName
colors = {}
for lithology in data['LithologyName'].unique():
    colors[lithology] = np.random.rand(3,)
data['Color'] = data['LithologyName'].apply(lambda x: colors[x])

# Define the figure and axis
fig, ax = plt.subplots(figsize=(6, 4))

# Create a stacked bar chart for each borehole
for borehole in data['Identifier'].unique():
    borehole_data = data[data['Identifier'] == borehole].sort_values(by='DepthToBottom')
    bottom = borehole_data['DepthToTop'].tolist()
    height = (borehole_data['DepthToBottom'] - borehole_data['DepthToTop']).tolist()
    ax.barh(borehole_data['LithologyName'], height, left=bottom, color=borehole_data['Color'])

# Set the axis labels and title
ax.set_xlabel('Depth (m)')
ax.set_ylabel('Lithology')
ax.set_title('Borehole Lithology')

# Invert the y-axis
ax.invert_yaxis()

# Show the plot
plt.show()
