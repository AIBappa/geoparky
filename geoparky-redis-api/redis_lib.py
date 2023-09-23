"""
    List of helper functions used to connect to Redis cloud, store and query geospatial points
"""
import redis
from datetime import datetime

def create_redis_client(host_url, host_password, port = 16271):
    # Create redis cloud connection object
    r = redis.Redis(
        host = host_url,
        port = port,
        password = password
    )

    return r

def add_geospatial_point(redis_client_object, latitude, longitude,
        collection_name = "geoparky:collection"):
    # Create point ID based on current time of creation
    date = datetime.utcnow() - datetime(1970, 1, 1)
    milliseconds_identifier = round(date.total_seconds() * 1000)
    point_identifier = f"point_{milliseconds_identifier}"
    
    # Add the point to the collection
    status = redis_client_object.geoadd(
        collection_name, 
        [
            longitude,
            latitude,
            point_identifier
        ]
    )

    return status

def find_geospatial_points_within_radius(redis_client_object, latitude,
        longitude, radius=2000, unit="m",
        collection_name="geoparky:collection"):
    # Find closest neighbours within radius
    if radius < 0:
        radius = -radius
    
    unit = unit.lower()

    results = redis_client_object.geosearch(
        collection_name,
        longitude = longitude,
        latitude = latiude,
        radius = radius,
        unit = unit
    )

    return result

