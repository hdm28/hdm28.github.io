import pandas as pd
import folium

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve boreholes.csv')

# Create a set to store unique locations
locations = set()

# Create a map centered on South Africa
map_sa = folium.Map(location=[-25.513586, 28.098897], zoom_start=10)

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
    depth_labels = '<br>'.join([str(x) for x in location_data['DepthToBottom'].tolist()])
    tooltip = "<span style='font-size: 20pt;'>Location: {}<br>DepthToBottom: {}</span>".format(identifier, depth_labels)
    folium.CircleMarker(
        location   = [lat, lon],
        radius     = 5,
        fill_color = 'blue',
        color      = 'blue',
        fill_opacity = 1,
        tooltip    = tooltip,
    ).add_to(map_sa)

# Save the map
map_sa.save('mapv12.html')


