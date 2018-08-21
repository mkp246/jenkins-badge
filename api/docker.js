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
        let svg = badge({
            subject: 'tags',
            status: data.tags.length.toString(),
            color: 'blue',
        }, normal);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

docker.get("/:path/size", (req, res) => {
    let path = req.params.path;
    dbg("repo: %s", path);
    dockerApi.getSize(path, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let size = data.layers.reduce((sum, layer) => sum + layer.size, data.config.size);
        size /= 1e6; //convert bytes to MB
        let svg = badge({
            subject: 'size',
            status: size.toFixed(2) + " MB",
            color: 'blue',
        }, normal);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

docker.get("/:path/layers", (req, res) => {
    let path = req.params.path;
    dbg("repo: %s", path);
    dockerApi.getLayers(path, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let svg = badge({
            subject: 'layers',
            status: data.layers.length.toString(),
            color: 'blue',
        }, normal);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

module.exports = docker;
