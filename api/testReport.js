var express = require('express');
const status = express.Router();
const badge = require('../badge/badge');
const normal = require('../badge/template/normal');

status.get("/:job", function(req, res) {
    var job = req.params.job;
    jenkins.lastBuildInfo(job, (err, data) => {
        var result = data.result;
        dbg(data);
        dbg(result);
        let color = (result == 'SUCCESS') ? 'green' : 'red';
        var svg = badge({
            subject: 'last',
            status: result,
            color: color
        }, normal);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

module.exports = function(dbg, jenkins) {
    this.dbg = dbg;
    this.jenkins = jenkins
    return status;
};
