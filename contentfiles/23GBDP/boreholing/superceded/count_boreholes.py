import pandas as pd
import folium
from math import radians, cos, sin, asin, sqrt

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve boreholes.csv')

# Create a set to store unique locations
locations = set()

# Create a map centered on South Africa
map_sa = folium.Map(location=[-25.513586, 28.098897], zoom_start=11)

# Calculate the maximum distance from the map centre in km
max_distance_km = 15

# Add circle markers to the map for each unique location within the max distance
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
    distance_km = haversine_distance(map_sa.center[1], map_sa.center[0], lat, lon)

    # Check if this location is within the max distance
    if distance_km > max_distance_km:
        continue

   # Check if this location has already been plotted
if (lat, lon) in locations:
    continue

# Add this location to the set of plotted locations
locations.add((lat, lon))

# Create a circle marker for this location
depth_labels = ['Layer {}'.format(i+1) for i in range(len(location_data))]
table_rows = [[depth_labels[i], str(location_data.iloc[i]['DepthToBottom']), location_data.iloc[i]['LithologyName']] for i in range(len(location_data))]
table_headers = ['Depth', 'DepthToBottom', 'LithologyName']
tooltip = "<table style='font-size: 14px; border-collapse: collapse;'><tr>{}</tr>{}</table>".format(
    ''.join(['<th style="border: 1px solid black; padding: 5px;">{}</th>'.format(header) for header in table_headers]),
    ''.join(['<tr>{}</tr>'.format(''.join(['<td style="border: 1px solid black; padding: 5px;">{}</td>'.format(row[i]) for i in range(len(table_headers))])) for row in table_rows])
folium.CircleMarker(
    location   = [lat, lon],
    radius     = 5,
    fill_color = 'blue',
    color      = 'blue',
    fill_opacity = 1,
    tooltip    = tooltip,
).add_to(map_sa)


# Save the map
map_sa.save('mapv18.html')


def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees)
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
