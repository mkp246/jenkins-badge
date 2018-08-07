var express = require('express');
const testReport = express.Router();
const testBadge = require('../badge/testBadge');
const test = require("../badge/template/test");

testReport.get("/:job", function(req, res) {
    var job = req.params.job;
    jenkins.lastCompletedBuildTestReport(job, (err, data) => {
        dbg(data);
        var svg = testBadge({
            subject: 'tests',
            status1: data.failCount.toString(),
            status2: data.skipCount.toString(),
            status3: data.totalCount.toString()
        }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

module.exports = function(dbg, jenkins) {
    this.dbg = dbg;
    this.jenkins = jenkins
    return testReport;
};
