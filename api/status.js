const status = require('express').Router();
const jenkins = require('../lib/jenkinsApi');
const dbg = require('debug')('api:status:');
const badge = require('../badge/badge');
const testBadge = require('../badge/testBadge');
const normal = require('../badge/template/normal');
const nowAnim = require("../badge/template/nowAnim");


status.get("/:job/last", function(req, res) {
    var job = req.params.job;
    dbg("job: %s", job);
    jenkins.lastCompletedBuildInfo(job, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        let result = data.result;
        dbg(data);
        dbg(result);
        let color = (result == 'SUCCESS') ? 'green' : 'red';
        let svg = badge({
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
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        let building = data.building;
        dbg(data);
        if (building) {
            let percentDone = Math.round((new Date().getTime() - data.timestamp) / data.estimatedDuration * 100);
            let etaMessage;
            if (percentDone < 100) {
                let eta = (100 - percentDone) * data.estimatedDuration / (1000 * 3600 * 100);
                etaMessage = "+" + Math.floor(eta) + "h" + Math.ceil((eta % 1) * 60) + "m";
            } else {
                etaMessage = "UNKNOWN";
            }
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

module.exports = status;
