const https = require('https');
const http = require('http');
const dbg = require('debug')('lib:request:');
const endPointParser = require('./endPointParser');

const request = {};
request.get = function(host, port, path, query, headers, callback) {
    get(host, port, path, query, headers, callback, https);
};

request.getInsecure = function(host, port, path, query, headers, callback) {
    get(host, port, path, query, headers, callback, http);
}

function get(host, port, path, query, headers, callback, http) {
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'GET',
        headers: headers
    };
    if (query != null && query.length > 0) {
        options.path += '?' + query;
    }
    dbg(options);
    let request = http.request(options, res => {
        let chunk = [];
        res.setEncoding('utf8');
        res.on('data', data => {
            chunk.push(data);
        });
        res.on('end', () => {
            let data = chunk.join('');
            dbg('statusCode:' + res.statusCode);
            if (res.statusCode.toString().startsWith(2)) {
                callback(null, data);
            } else {
                callback(data, null);
            }
        });
        res.on('error', e => {
            dbg('error:' + e.message);
            callback(e, null);
        });
    })
    request.on('error', (err) => {
        dbg('connection failed: %s', err.message);
        callback(err, null);
    });
    request.end();
}

const ghConfig = {};
[ghConfig.host, ghConfig.port, ghConfig.prefix] = endPointParser(process.env.GITHUB_GRAPHQL_END_POINT);
ghConfig.path = "/" + ghConfig.prefix;
ghConfig.token = "token " + process.env.GITHUB_TOKEN;
dbg(ghConfig);

request.gitHubGQLPost = function(graphQuery, callback) {
    const options = {
        hostname: ghConfig.host,
        port: ghConfig.port,
        path: ghConfig.path,
        method: 'POST',
        headers: {
            "Authorization": ghConfig.token
        }
    };
    let request = https.request(options, res => {
        let chunk = [];
        res.setEncoding('utf8');
        res.on('data', data => {
            chunk.push(data);
        });
        res.on('end', () => {
            let data = chunk.join();
            if (res.statusCode.toString().startsWith(2)) {
                callback(null, data);
            } else {
                callback(data, null);
            }
        });
        res.on('error', e => {
            dbg('error:' + e.message);
            callback(e, null);
        });
    });
    let escapedQuery = graphQuery.replace(/"(.*?)"/g, '\\"$1\\"');
    let data = `{"query":"query${escapedQuery}"}`;
    dbg(data);
    request.write(data);
    request.end();
    request.on('error', (err) => {
        dbg('connection failed: %s', err.message);
        callback(err, null);
    });
};

module.exports = request;
