var jenkins = {};
const URL = require('url').URL;
const dbg = require('debug')('app:jenkinsApi:');
const qs = require('querystring');

jenkins.init = function() {
    let jenkinsHost = process.env.JENKINS_HOST;
    let jenkinsPort = process.env.JENKINS_PORT;
    let prefix = process.env.JENKINS_PREFIX || "";
    const types = {
        LAST_BUILD: "/lastBuild"
    };

    function buildPath(job, type) {
        const API = '/api/json'
        return "/" + prefix + "/job/" + job + type + API;
    };

    const request = {
        get: function(path, query, callback) {
            const options = {
                hostname: jenkinsHost,
                port: jenkinsPort,
                path: path,
                method: 'GET'
            };
            if (query != null) {
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
        }
    };

    var jenkins = {};
    jenkins.lastBuildInfo = function(job, callback) {
        let query = qs.stringify({
            tree: "result"
        }); //retrive part of json data only needed
        request.get(buildPath(job, types.LAST_BUILD), query, callback);
    };

    return jenkins;
};
module.exports = function(https) {
    this.https = https;
    return jenkins;
};
