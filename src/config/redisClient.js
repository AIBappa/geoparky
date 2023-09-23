const redis = require("redis");

const redisUrl = process.env.redisURL;
const redisPassword = process.env.redisPassword;

const client = redis.createClient({
    url: redisUrl,
    password: redisPassword
});

var redisGeoClient = require('georedis').initialize(client)

export default redisGeoClient;