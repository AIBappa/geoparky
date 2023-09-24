from fastapi import FastAPI, status, Request
from fastapi.middleware.cors import CORSMiddleware
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


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}



# Nearest points' route
@app.post('/nearby')
async def nearby_points(request: Request):
    global r

    input_json = await request.json()
    latitude = str(input_json["latitude"])
    longitude = str(input_json["longitude"])

    num_points = get_number_risk_points(latitude, longitude)
    response = {
        "latitude" : latitude,
        "longitude" : longitude,
        "points" : num_points
    }
    return response