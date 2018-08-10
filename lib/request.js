const request = {};

request.get = function(path, query, callback) {
    const options = {
        hostname: jenkinsHost,
        port: jenkinsPort,
        path: path,
        method: 'GET'
    };
    if (query != null && query.length > 0) {
        options.path += '?' + query;
    }
    https.request(options, res => {
            res.setEncoding('utf8');
            res.on('data', data => {
                dbg('statusCode:' + res.statusCode);
                callback(null, JSON.parse(data));
            });
            res.on('error', e => {
                dbg('error:' + e.message);
                callback(e, null);
            });
        })
        .end();
};

module.exports = request;
