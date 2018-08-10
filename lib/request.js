const https = require('https');
const dbg = require('debug')('lib:request:');
const request = {};

request.get = function(host, port, path, query, callback) {
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'GET'
    };
    if (query != null && query.length > 0) {
        options.path += '?' + query;
    }
    dbg(options);
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
