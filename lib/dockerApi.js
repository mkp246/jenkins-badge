const request = require('./request');
const dbg = require('debug')('lib:dockerApi:');
const endPointParser = require('./endPointParser');

const config = {};
const dockerApi = {};

const types = Object.freeze({
    TAGS: "/tags/list",
    MANIFEST: "/manifests/latest"
});

const accept = Object.freeze({
    V1_MANIFEST: "application/vnd.docker.distribution.manifest.v1+json",
    V2_MANIFEST: "application/vnd.docker.distribution.manifest.v2+json"
});

dockerApi.init = function() {
    [config.host, config.port] = endPointParser(process.env.DOCKER_HUB_ENDPOINT);
    config.headers = {
        "Authorization": process.env.DOCKER_HUB_AUTH
    };
    dbg(config);
}

dockerApi.getTags = function(path, callback) {
    getDocker(buildPath(path, types.TAGS), null, callback);
};

dockerApi.getSize = function(path, callback) {
    getDocker(buildPath(path, types.MANIFEST), accept.V2_MANIFEST, callback);
};

dockerApi.getLayers = dockerApi.getSize;

function buildPath(path, type) {
    return `/v2/${path.replace(':','/')}${type}`;
}

function getDocker(path, accept, callback) {
    config.headers.Accept = accept || '';
    request.get(config.host, config.port, path, null, config.headers, callback);
}

module.exports = dockerApi;
