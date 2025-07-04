import pandas as pd
import folium

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve boreholes.csv')

# Filter out rows with missing DepthToBottom values
data = data.dropna(subset=['DepthToBottom'])

# Create a map centered on South Africa
map_sa = folium.Map(location=[-25.513586, 28.098897], zoom_start=10)

# Create a dictionary to store unique locations and their associated depths
location_depths = {}

# Loop through each row in the data and add the depth value to the corresponding location in the dictionary
for index, row in data.iterrows():
    if pd.notna(row['DepthToBottom']):
        location = (row['Latitude'], row['Longitude'])
        depth = row['DepthToBottom']
        if location in location_depths:
            location_depths[location].append(depth)
        else:
            location_depths[location] = [depth]

# Loop through each unique location and add a circle marker to the map
for location, depths in location_depths.items():
    tooltip_text = "Depths: " + ", ".join(str(d) for d in depths)
    folium.CircleMarker(location=location, radius=2, fill_color='red', fill_opacity=1, tooltip=tooltip_text).add_to(map_sa)

# Save the map
map_sa.save('mapv10.html')
