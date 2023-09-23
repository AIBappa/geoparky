"""
    Populate the data from Bangalore-preprocessed dataset
"""
from redis_lib import create_redis_client, add_geospatial_point, find_geospatial_points_within_radius
import pandas as pd
from tqdm import tqdm
import os

# Load the dataset
df = pd.read_csv("../traffic-danger-points-analysis/bangalore_danger_spots.csv")

# Create the Redis client
r = create_redis_client(
    host_url = os.environ["REDIS_URL"],
    host_password = os.environ["REDIS_PASSWORD"]
)

# Iterate through the dataframe and add the points to the redis db
for i in tqdm(range(len(df))):
    row = df.iloc[i]
    status = add_geospatial_point(
        redis_client_object = r,
        latitude = float(row["latitude"]),
        longitude = float(row["longitude"]),
        collection_name = "geoparky"
    )
    if status != 1:
        print(f"Error while adding row {i}")
