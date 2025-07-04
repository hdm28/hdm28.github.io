import pandas as pd
import folium
import branca.colormap as cm

# Load the CSV file using pandas
data = pd.read_csv('bigfatdata_filtered.csv')

# Extract the latitude and longitude columns
latitudes = data['Latitude']
longitudes = data['Longitude']
depths = data['WaterLevel']

# Filter out depths over 30m
depths_filtered = depths.apply(lambda x: 30 if x >= 30 else x)

# Create a list of unique depths
depths_sorted = sorted(depths_filtered.unique())

# Define a colormap for the depth values
cmap = cm.StepColormap(['white'] + cm.linear.Reds_09.colors, vmin=min(depths), vmax=30, index=depths_sorted)

# Create a map centered on South Africa
map_sa = folium.Map(location=[-25.513586, 28.098897], zoom_start=10)

# Create a set to store unique combinations of latitude and longitude
locations = set()

# Add circle markers to the map for each latitude and longitude within the specified range
for lat, lon, dep in zip(latitudes, longitudes, depths):
    if -26 <= lat <= -25 and 27.5 <= lon <= 28.5:
        # Check if the depth value is missing
        if pd.isna(dep):
            continue  # Skip this point if depth value is missing

        # Check if this location has already been plotted
        if (lat, lon) in locations:
            continue  # Skip this point if location has already been plotted

        # Add this location to the set of plotted locations
        locations.add((lat, lon))
        
        # Create a circle marker for each point
        if dep == 30:
            depth_label = '30+'
        else:
            depth_label = str(dep)
    
        if cmap.index[0] <= dep <= cmap.index[-1]:
            folium.Circle(location=[lat, lon], radius=2, fill_color=cmap(dep), color=cmap(dep), fill_opacity=1, tooltip=f"Depth: {depth_label} m").add_to(map_sa)

# Add the colormap to the map as a legend
cmap.caption = 'Depth to water (m)'
map_sa.add_child(cmap)

#Save the map
map_sa.save('mapv5.html')

