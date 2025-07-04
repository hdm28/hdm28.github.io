import pandas as pd
import folium

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve boreholes.csv')

# Create a set to store unique locations
locations = set()

# Create a map centered on South Africa
map_sa = folium.Map(location=[-25.513586, 28.098897], zoom_start=11)

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

    # Check if this location has already been plotted
    if (lat, lon) in locations:
        continue

    # Add this location to the set of plotted locations
    locations.add((lat, lon))

    # Create a circle marker for this location
    tooltip = "<span style='font-size: 16pt;'>Location: {}<br>".format(identifier)
    for depth, lithology in zip(location_data['DepthToBottom'], location_data['LithologyName']):
        if pd.notnull(depth):
            tooltip += "DepthToBottom: {}m {}<br>".format(depth, lithology)
            
    folium.CircleMarker(
        location   = [lat, lon],
        radius     = 5,
        fill_color = 'blue',
        color      = 'blue',
        fill_opacity = 1,
        tooltip    = tooltip,
    ).add_to(map_sa)

# Save the map
map_sa.save('mapv14.html')
