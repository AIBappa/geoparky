"""
    Hosting the nearest neighbours' functionality in a Flask API
"""
from flask import Flask, request
from redis_lib import create_redis_client, add_geospatial_point, find_geospatial_points_within_radius
import os

# Create the Redis client
r = create_redis_client(
    host_url = os.environ["REDIS_URL"],
    host_password = os.environ["REDIS_PASSWORD"]
)

# Get number of nearest neighbours functionality
def get_number_risk_points(latitude, longitude):
    latitude = float(latitude)
    longitude = float(longitude)

    points = find_geospatial_points_within_radius(r, latitude, longitude, radius = 1000, collection_name="geoparky")
    return len(points)

# Set up flask app
app = Flask(__name__)

# Base route
@app.route('/')
def hello_world():
    return 'Hello from REDIS API!'

# Nearest points' route
@app.route('/nearby', methods = ['POST'])
def nearby_points():
    global r

    input_json = request.get_json()
    latitude = str(input_json["latitude"])
    longitude = str(input_json["longitude"])

    num_points = get_number_risk_points(latitude, longitude)
    output = {
        "latitude" : latitude,
        "longitude" : longitude,
        "points" : num_points
    }

    return output

if __name__ == "__main__":
    app.run()