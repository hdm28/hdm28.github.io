import pandas as pd
import folium
from folium.plugins import HeatMap

# Load the CSV file using pandas
data = pd.read_csv('bigfatdata.csv')

# Extract the latitude and longitude columns
latitudes = data['Latitude']
longitudes = data['Longitude']
depths = data['WaterLevel']

# Filter out depths over 30m
depths_filtered = depths.apply(lambda x: 30 if x >= 30 else x)

# Create a list of tuples for the heatmap
heat_data = [(lat, lon, dep) for lat, lon, dep in zip(latitudes, longitudes, depths_filtered)
             if -26 <= lat <= -25 and 27.5 <= lon <= 28.5 and not pd.isna(dep)]

# Create a map centered on South Africa
m = folium.Map(location=[-25.513586, 28.098897], zoom_start=10, tiles='cartodbpositron')

# Create a HeatMap layer
heatmap = HeatMap(heat_data, name='Depth heatmap', min_opacity=0.2, radius=20)


# Add the HeatMap layer to the map
heatmap.add_to(m)

# Add a layer control to the map
folium.LayerControl().add_to(m)

# Filter the data to only include points within the specified range
data_filtered = data[(data['Latitude'] >= -26) & (data['Latitude'] <= -25) &
                     (data['Longitude'] >= 27.5) & (data['Longitude'] <= 28.5)]

# Add layer control to toggle heatmap and legend
folium.LayerControl().add_to(m)

# Save the map to an HTML file
m.save('mapv4.html')
