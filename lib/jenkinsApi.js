var jenkins = {};
const URL = require('url').URL;
const dbg = require('debug')('app:jenkinsApi:');
const qs = require('querystring');

jenkins.init = function() {
    let jenkinsHost = process.env.JENKINS_HOST;
    let jenkinsPort = process.env.JENKINS_PORT;
    let prefix = process.env.JENKINS_PREFIX || "";
    const types = {
        LAST_COMPLETED_BUILD: "/lastCompletedBuild",
        LAST_BUILD: "/lastBuild",
        LAST_COMPLETED_BUILD_TEST_REPORT: "/lastCompletedBuild/testReport",
        LAST_SUCCESSFUL_BUILD_JACOCO_REPORT: "/lastSuccessfulBuild/jacoco",
    };
    const API = '/api/json';

    function buildPath(job, type) {
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
        }
    };

    var jenkins = {};
    jenkins.lastCompletedBuildInfo = function(job, callback) {
        let query = qs.stringify({
            tree: "result"
        });
        request.get(buildPath(job, types.LAST_COMPLETED_BUILD), query, callback);
    };

    jenkins.lastCompletedBuildTestReport = function(job, callback) {
        let query = qs.stringify({
            depth: -1
        });
        request.get(buildPath(job, types.LAST_COMPLETED_BUILD_TEST_REPORT), query, callback);
    };

    jenkins.currentBuildInfo = function(job, callback) {
        let query = qs.stringify({
            tree: "building,estimatedDuration,timestamp"
        });
        request.get(buildPath(job, types.LAST_BUILD), query, callback);
    };

    jenkins.lastSuccessfulBuildJacocoReport = function(job, matrix, callback) {
        matrix = matrix || '*';
        dbg(matrix);
        let query = qs.stringify({
            tree: matrix + "[percentage]"
        });
        request.get(buildPath(job, types.LAST_SUCCESSFUL_BUILD_JACOCO_REPORT), query, callback);
    };

    return jenkins;
};
module.exports = function(https) {
    this.https = https;
    return jenkins;
};
