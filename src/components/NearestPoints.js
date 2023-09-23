import redisGeoClient from "../config/redisClient";

async function getNearestPoints(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const collectionName = "geoparky";

    var locations = null;

    // Find nearby locations using georedis
    redisGeoClient.nearby({latitude: latitude, longitude: longitude}, 2000, function(err, res){
        if(err) console.error(err);
        locations = res;
    })

    return locations;
}

export default getNearestPoints;