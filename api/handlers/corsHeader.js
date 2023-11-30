module.exports.handler = async (event) => {
    const response = event.Records[0].cf.response;
    const headers = response.headers;

    // Add CORS headers for all methods
    headers['access-control-allow-origin'] = [{ key: 'Access-Control-Allow-Origin', value: '*' }];
    headers['access-control-allow-methods'] = [{ key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS, PUT, POST, DELETE' }];
    headers['access-control-allow-headers'] = [{ key: 'Access-Control-Allow-Headers', value: 'Content-Type' }];

    return response;
};