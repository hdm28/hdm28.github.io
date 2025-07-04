import pandas as pd
import folium

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve boreholes.csv')

# Filter out data with no value in DepthToBottom
data = data[data['DepthToBottom'].notna()]

# Create a map centered on South Africa
map_sa = folium.Map(location=[-25.513586, 28.098897], zoom_start=10)

# Create a set to store unique identifiers
identifiers = set()

# Add circle markers to the map for each location
for idx, row in data.iterrows():
    # Extract the identifier, latitude, longitude, and DepthToBottom values
    identifier = row['Identifier']
    lat = row['Latitude']
    lon = row['Longitude']
    depth = row['DepthToBottom']
    
    # Check if this identifier has already been plotted
    if identifier in identifiers:
        continue  # Skip this location if it has already been plotted
    
    # Add this identifier to the set of plotted identifiers
    identifiers.add(identifier)
    
    # Create a circle marker for each location
    folium.Circle(location=[lat, lon], radius=200, fill_color='red', color='red', fill_opacity=1, marker=True, tooltip=f"DepthToBottom: {depth} m").add_to(map_sa)

#Save the map
map_sa.save('mapv6.html')
