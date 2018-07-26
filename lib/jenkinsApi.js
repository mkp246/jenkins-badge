var jenkins = {};
const URL = require('url').URL;
const dbg = require('debug')('app:jenkinsApi:');

jenkins.init = function(jenkinsHost, JenkinsPort, prefix) {
    prefix = prefix || "";

    const types = {
        LAST_BUILD: "/lastBuild"
    };

    function buildPath(job, type) {
        const API = '/api/json'
        return "/" + prefix + "/job/" + job + type + API;
    };

    const request = {
        get: function(path, callback) {
            const options = {
                hostname: jenkinsHost,
                port: JenkinsPort,
                path: path,
                method: 'GET'
            };
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
        request.get(buildPath(job, types.LAST_BUILD), callback);
    };

    return jenkins;
};
module.exports = function(https) {
    this.https = https;
    return jenkins;
};
