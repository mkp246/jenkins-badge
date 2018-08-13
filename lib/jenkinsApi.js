const dbg = require('debug')('lib:jenkinsApi:');
const qs = require('querystring');
const endPointParser = require('./endPointParser');
const request = require('./request');

const types = {
    LAST_COMPLETED_BUILD: "/lastCompletedBuild",
    LAST_BUILD: "/lastBuild",
    LAST_COMPLETED_BUILD_TEST_REPORT: "/lastCompletedBuild/testReport",
    LAST_SUCCESSFUL_BUILD_JACOCO_REPORT: "/lastSuccessfulBuild/jacoco"
};
const API = '/api/json';

function buildPath(job, type) {
    return "/" + config.jenkinsPrefix + "/job/" + job + type + API;
};

const config = {}
const jenkins = {};
jenkins.init = function() {
    [config.jenkinsHost, config.jenkinsPort, config.jenkinsPrefix] = endPointParser(process.env.JENKINS_ENDPOINT);
    dbg(config);
}

jenkins.lastCompletedBuildInfo = function(job, callback) {
    let query = qs.stringify({
        tree: "result"
    });
    getJenkins(buildPath(job, types.LAST_COMPLETED_BUILD), query, callback);
};

jenkins.lastCompletedBuildTestReport = function(job, callback) {
    let query = qs.stringify({
        depth: -1
    });
    getJenkins(buildPath(job, types.LAST_COMPLETED_BUILD_TEST_REPORT), query, callback);
};

jenkins.currentBuildInfo = function(job, callback) {
    let query = qs.stringify({
        tree: "building,estimatedDuration,timestamp"
    });
    getJenkins(buildPath(job, types.LAST_BUILD), query, callback);
};

jenkins.lastSuccessfulBuildJacocoReport = function(job, matrix, callback) {
    matrix = matrix || '*';
    dbg(matrix);
    let query = qs.stringify({
        tree: matrix + "[percentage]"
    });
    getJenkins(buildPath(job, types.LAST_SUCCESSFUL_BUILD_JACOCO_REPORT), query, callback);
};

function getJenkins(path, query, callback) {
    request.get(config.jenkinsHost, config.jenkinsPort, path, query, null, callback);
}

module.exports = jenkins;
