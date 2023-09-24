import { createClient } from 'redis';
import { initialize } from 'georedis';

const redisUrl = process.env.REACT_APP_redisURL;
const redisPassword = process.env.REACT_APP_redisPassword;

const client = createClient({
    url: redisUrl,
    password: redisPassword
});

var redisGeoClient = initialize(client)

export default redisGeoClient;