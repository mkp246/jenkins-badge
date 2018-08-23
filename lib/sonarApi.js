const request = require('./request');
const dbg = require('debug')('lib:sonarApi:');
const endPointParser = require('./endPointParser');
const qs = require('querystring');

const config = {};
const sonarApi = {};
const paths = {};

sonarApi.init = function() {
    [config.host, config.port, config.prefix] = endPointParser(process.env.SONARQUBE_API_ENDPOINT);
    dbg(config);
    paths.MEASURE_COMPONETNS = `/${config.prefix}/measures/component`;
}

sonarApi.getMeasure = function(componentKey, metricKeys, callback) {
    let query = qs.stringify({
        componentKey,
        metricKeys
    });
    dbg(query);
    getSonar(paths.MEASURE_COMPONETNS, query, callback);
}

function getSonar(path, query, callback) {
    request.getInsecure(config.host, config.port, path, query, null, callback);
}

module.exports = sonarApi;
