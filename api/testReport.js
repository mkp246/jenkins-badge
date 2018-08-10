const testReport = require('express').Router();
const jenkins = require('../lib/jenkinsApi');
const dbg = require('debug')('api:testReport:');
const testBadge = require('../badge/testBadge');
const test = require("../badge/template/test");

testReport.get("/:job", function(req, res) {
    var job = req.params.job;
    jenkins.lastCompletedBuildTestReport(job, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        let svg = testBadge({
            subject: 'tests',
            status1: data.failCount.toString(),
            status2: data.skipCount.toString(),
            status3: data.totalCount.toString()
        }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

module.exports = testReport;
