const jacoco = require('express').Router();
const dbg = require('debug')('api:jacoco:');
const jenkins = require("../lib/jenkinsApi");
const normal = require("../badge/template/normal");
const badge = require("../badge/badge");

jacoco.get("/:job", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, null, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        data = JSON.parse(data);
        dbg(data);
        let averageLMC = (data.lineCoverage.percentage + data.methodCoverage.percentage + data.classCoverage.percentage) / 3;
        averageLMC = Math.round(averageLMC); ///LMC=line,method,class
        let svg = crateJacocoBadge('coverage', averageLMC, 85);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

jacoco.get("/:job/branch", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, "branchCoverage", (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        data = JSON.parse(data);
        dbg(data);
        let svg = crateJacocoBadge('branch', data.branchCoverage.percentage);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

jacoco.get("/:job/class", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, "classCoverage", (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        data = JSON.parse(data);
        dbg(data);
        let svg = crateJacocoBadge('class', data.classCoverage.percentage);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

jacoco.get("/:job/complexity", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, "complexityScore", (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        data = JSON.parse(data);
        dbg(data);
        let svg = crateJacocoBadge('complexity', data.complexityScore.percentage);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

jacoco.get("/:job/instruction", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, "instructionCoverage", (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        data = JSON.parse(data);
        dbg(data);
        let svg = crateJacocoBadge('instruction', data.instructionCoverage.percentage);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

jacoco.get("/:job/line", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, "lineCoverage", (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        data = JSON.parse(data);
        dbg(data);
        let svg = crateJacocoBadge('line', data.lineCoverage.percentage);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

jacoco.get("/:job/method", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, "methodCoverage", (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        data = JSON.parse(data);
        dbg(data);
        let svg = crateJacocoBadge('method', data.methodCoverage.percentage);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

function crateJacocoBadge(subject, percent, minPercent) {
    let isOK = (percent > (minPercent || 80));
    dbg("is Ok: " + isOK);
    return badge({
        subject: subject,
        status: percent + "%",
        color: isOK ? 'green' : 'red'
    }, normal);
}

module.exports = jacoco;
