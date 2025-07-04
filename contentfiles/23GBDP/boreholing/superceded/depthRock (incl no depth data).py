import pandas as pd
import folium

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve boreholes.csv')

# Create a set to store unique locations
locations = set()

# Create a map centered on South Africa
map_sa = folium.Map(location=[-25.513586, 28.098897], zoom_start=11)

# Add circle markers to the map for each location
for i in range(len(data)):
    # Get the data for this row
    row = data.iloc[i]

    # Get the latitude and longitude of this location
    lat = row['Latitude']
    lon = row['Longitude']

    # Check if this location has already been plotted
    if (lat, lon) in locations:
        continue

    # Add this location to the set of plotted locations
    locations.add((lat, lon))

    # Create a circle marker for this location
    depth_labels = '<br>'.join([str(x) for x in data[data['Identifier'] == row['Identifier']]['DepthToBottom'].tolist()])
    tooltip = "<span style='font-size: 20pt;'>Location: {}<br>DepthToBottom: {}</span>".format(row['Identifier'], depth_labels)
    fill_color = 'red' if pd.isna(row['DepthToBottom']) else 'blue'
    folium.CircleMarker(
        location   = [lat, lon],
        radius     = 5,
        fill_color = fill_color,
        color      = 'blue',
        fill_opacity = 1,
        tooltip    = tooltip
    ).add_to(map_sa)

# Save the map
map_sa.save('mapv13.html')
