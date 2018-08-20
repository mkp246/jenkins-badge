const request = require('./request');
const dbg = require('debug')('lib:dockerApi:');
const endPointParser = require('./endPointParser');

const config = {};
const dockerApi = {};

const types = Object.freeze({
    TAGS: "/tags/list"
});

dockerApi.init = function() {
    [config.host, config.port] = endPointParser(process.env.DOCKER_HUB_ENDPOINT);
    config.headers = {
        "Authorization": process.env.DOCKER_HUB_AUTH
    };
    dbg(config);
}

dockerApi.getTags = function(path, callback) {
    getDocker(buildPath(path, types.TAGS), callback);
};

function buildPath(path, type) {
    return `/v2/${path.replace(':','/')}${type}`;
}

function getDocker(path, callback) {
    request.get(config.host, config.port, path, null, config.headers, callback);
}

module.exports = dockerApi;
