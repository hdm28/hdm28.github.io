import pandas as pd
import folium

# Load the CSV file using pandas
data = pd.read_csv('Soshanguve50.csv')

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
    depth_labels = ['Layer {}'.format(i+1) for i in range(len(location_data))]
    table_rows = [[depth_labels[i], str(location_data.iloc[i]['DepthToBottom']), location_data.iloc[i]['LithologyName']] for i in range(len(location_data))]
    table_headers = ['Layer', 'Depth to bottom (m)', 'Lithology']
    tooltip_rows = ['<tr>{}</tr>'.format(''.join(['<td style="border: 1px solid black; padding: 5px;">{}</td>'.format(cell) for cell in row])) for row in table_rows]
    tooltip = '<table style="font-size: 14px; border-collapse: collapse;">{}<tbody>{}</tbody></table>'.format(
        '<tr>{}</tr>'.format(''.join(['<th style="border: 1px solid black; padding: 5px;">{}</th>'.format(header) for header in table_headers])),
        ''.join(tooltip_rows)
    )
    fill_color = 'red' if pd.isna(location_data['DepthToBottom']).all() else 'blue'
    folium.CircleMarker(
        location=[lat, lon],
        radius=5,
        fill_color=fill_color,
        color='blue',
        fill_opacity=1,
        tooltip=tooltip
    ).add_to(map_sa)

# Save the map
map_sa.save('mapv23.html')
