var express = require('express');
var custom = express.Router();
const badge = require('../badge/badge');
const anim = require('../badge/template/anim');
const noraml = require('../badge/template/normal');

custom.get("/:subject/:status/:color", function(req, res) {
    let [from, to] = req.params.color.split('-');
    if (to == null) {
        var svg = badge({
            subject: req.params.subject,
            status: req.params.status,
            color: req.params.color,
        }, noraml);
    } else {
        var svg = badge({
            subject: req.params.subject,
            status: req.params.status,
            from: from,
            to: to || yellow
        }, anim);
    }
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
})

module.exports = custom;
