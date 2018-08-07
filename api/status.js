var express = require('express');
var status = express.Router();
const badge = require('../badge/badge');
const testBadge = require('../badge/testBadge');
const normal = require('../badge/template/normal');
const nowAnim = require("../badge/template/nowAnim");

status.get("/:job/last", function(req, res) {
    var job = req.params.job;
    dbg("job: %s", job);
    jenkins.lastCompletedBuildInfo(job, (err, data) => {
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

status.get("/:job/now", function(req, res) {
    var job = req.params.job;
    dbg("job: %s", job);
    jenkins.currentBuildInfo(job, (err, data) => {
        var building = data.building;
        dbg(data);
        if (building) {
            let percentDone = Math.round((new Date().getTime() - data.timestamp) / data.estimatedDuration * 100);
            let eta = (100 - percentDone) * data.estimatedDuration / (1000 * 3600 * 100);
            let etaMessage = "+" + Math.floor(eta) + "h" + Math.ceil((eta % 1) * 60) + "m";
            var svg = testBadge({
                subject: 'now',
                status1: 'BUILDING',
                status2: percentDone + "%",
                status3: etaMessage,
                color2: 'blue',
                color3: 'yellow',
                from: 'persianRed',
                to: 'green'
            }, nowAnim);
        } else {
            var svg = badge({
                subject: 'now',
                status: 'STOPPED',
                color: 'blue',
            }, normal);
        }
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

module.exports = function(dbg, jenkins) {
    this.dbg = dbg;
    this.jenkins = jenkins
    return status;
};
