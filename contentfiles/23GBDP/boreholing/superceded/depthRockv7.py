import pandas as pd
import folium
from folium import FeatureGroup
from math import radians, cos, sin, sqrt
import ipywidgets as widgets

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve boreholes.csv')

# Create a set to store unique locations
locations = set()

# Create a map centered on South Africa
map_sa = folium.Map(location=[-25.513586, 28.098897], zoom_start=11)

# Define a function to add circle markers to the map for each unique location within the given max distance
def add_circle_markers(max_distance_km):
    # Clear the current map
    map_sa._children = []

    # Add circle markers to the map for each unique location within the max distance
    for identifier in data['Identifier'].unique():
        # Get the data for this location
        location_data = data[data['Identifier'] == identifier]

        # Filter out locations with no depth data
        if location_data['DepthToBottom'].isna().all():
            continue

        # Return early if the dataframe is empty
        if location_data.empty:
            continue

        # Iterate over each row in the dataframe and create a circle marker
        for i, row in location_data.iterrows():
            # Get the latitude and longitude of this row
            lat = row['Latitude']
            lon = row['Longitude']

        # Calculate the distance from the map centre to this location in km
        lat_diff_km = 111.32 * abs(map_sa.location[0] - lat)
        lon_diff_km = 111.32 * abs(map_sa.location[1] - lon) * cos(radians(lat))
        distance_km = sqrt(lat_diff_km**2 + lon_diff_km**2)

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
            ''.join(['<tr>{}</tr>'.format(''.join(['<td style="border: 1px solid black; padding: 5px;">{}</td>'.format(row[i]) for i in range(len(table_headers))])) for row in table_rows]))
        feature_group = folium.FeatureGroup()
        folium.CircleMarker(location=[location_data.iloc[i]["lat"], location_data.iloc[i]["lon"]],
                    radius=5,
                    weight=1,
                    color="#333333",
                    opacity=0.7,
                    fill=True,
                    fill_color=color_producer(row["depth"]),
                    fill_opacity=1,
                    tooltip=f"{row['depth']} m"
                   ).add_to(feature_group)
        feature_group.add_to(map_sa)



# Define a function to update the map based on the slider value
def update_map(change):
    max_distance_km = change.new
    add_circle_markers(max_distance_km)

# Create a slider widget
slider = widgets.FloatSlider(
    value=15,
    min=1,
    max=50,
    step=1,
    description='Max Distance (km):',
    continuous_update=True
)

# Display the map and slider widget
print(map_sa._repr_html_())
print(slider)

# Initialize the map with the default max distance
add_circle_markers(slider.value)

# Attach the update_map function to the slider's value attribute
slider.observe(update_map, 'value')
