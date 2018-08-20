const docker = require('express').Router();
const dbg = require('debug')('api:docker:');
const badge = require('../badge/badge');
const normal = require('../badge/template/normal');
const dockerApi = require('../lib/dockerApi');

docker.get("/:path/tags", (req, res) => {
    let path = req.params.path;
    dbg("repo: %s", path);
    dockerApi.getTags(path, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let tags = data.tags.length;
        let svg = badge({
            subject: 'tags',
            status: data.tags.length.toString(),
            color: 'blue',
        }, normal);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

function getPathOrNull(json, path) {
    let paths = path.split('.');
    while ((json != null) && (paths.length > 0)) {
        json = json[paths.shift()];
    }
    return json;
}

module.exports = docker;
