import pandas as pd
import folium
import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
import base64

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve boreholes.csv')

# Assign a random color to each unique LithologyName
colors = {}
for lithology in data['LithologyName'].unique():
    colors[lithology] = np.random.rand(3,)
data['Color'] = data['LithologyName'].apply(lambda x: colors[x])

# Create a set to store unique locations
locations = set()

# Create a map centered on South Africa
map_sa = folium.Map(location=[-25.513586, 28.098897], zoom_start=11)

# Define a function to generate a stacked bar chart as an image
def plot_barchart(data):
    fig, ax = plt.subplots(figsize=(6, 2))
    bottom = data['DepthToTop']
    height = data['DepthToBottom'] - data['DepthToTop']
    ax.barh(data['LithologyName'], height, left=bottom, color=data['Color'])
    ax.set_ylim(ax.get_ylim()[::-1])
    ax.set_xlabel('Depth (m)')
    ax.set_ylabel('Rock Type')
    plt.tight_layout()
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

# Define a dictionary to store colors for each rock type
color_dict = {}

# Calculate the maximum distance from the map centre in km
max_distance_km = 10

# Add circle markers to the map for each unique location
for identifier in data['Identifier'].unique():
    
    # Get the data for this location
    location_data = data[data['Identifier'] == identifier]

    # Filter out locations with no depth data
    if location_data['DepthToBottom'].isna().all():
        continue

    # Get the latitude and longitude of this location
    lat = location_data.iloc[0]['Latitude']
    lon = location_data.iloc[0]['Longitude']

    # Calculate the distance from the map centre to this location in km
    lat_diff_km = 111.32 * abs(map_sa.location[0] - lat)
    lon_diff_km = 111.32 * abs(map_sa.location[1] - lon)
    distance_km = (lat_diff_km**2 + lon_diff_km**2)**0.5
    
    # Check if this location is within the max distance
    if distance_km > max_distance_km:
        continue
    
    # Check if this location has already been plotted
    if (lat, lon) in locations:
        continue

    # Add this location to the set of plotted locations
    locations.add((lat, lon))

    # Create a circle marker for this location
    table_rows = ''
    for i in range(len(location_data)):
        depth_label = 'Layer {}'.format(i+1)
        lithology = location_data.iloc[i]['LithologyName']
        layers = plot_barchart(location_data.iloc[i:i+1])
        table_rows += '<tr><td>{}</td><td>{}</td><td>{}</td></tr>'.format(depth_label, lithology, layers)
    table = '<table><tr><th>Depth</th><th>Lithology</th><th>Layers</th></tr>{}</table>'.format(table_rows)

    # Create the tooltip using the HTML table
    tooltip = folium.map.Tooltip(table, sticky=True)
    fill_colors = [data[data['LithologyName'] == lith]['Color'].iloc[0] for lith in location_data['LithologyName'].unique()]
    fill_color = 'red' if pd.isna(location_data['DepthToBottom']).all() else fill_colors
    folium.CircleMarker(
        location=[lat, lon],
        radius=5,
        fill_color=fill_color,
        color='blue',
        fill_opacity=1,
        tooltip=tooltip
    ).add_to(map_sa)

# Save the map
map_sa.save('mapv22.html')


###
# Create a table with depth, lithology, and layers information


