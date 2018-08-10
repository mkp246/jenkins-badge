const https = require('https');
const dbg = require('debug')('lib:request:');
const endPointParser = require('./endPointParser');

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
            let chunk = [];
            res.setEncoding('utf8');
            res.on('data', data => {
                chunk.push(data);
            });
            res.on('end', () => {
                let data = chunk.join();
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
            callback(null, data);
        });
        res.on('error', e => {
            dbg('error:' + e.message);
            callback(e, null);
        });
    });
    let escapedQuery = graphQuery.replace(/"/g, '\\"')
    let data = `{"query":"query${escapedQuery}"}`;
    dbg(data);
    request.write(data);
    request.end();
};

module.exports = request;
