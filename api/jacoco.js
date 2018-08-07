var express = require('express');
const jacoco = express.Router();
const testBadge = require('../badge/testBadge');
const test = require("../badge/template/test");

jacoco.get("/:job", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, (err, data) => {
        dbg(data);
        // var svg = testBadge({
        //     subject: 'tests',
        //     status1: data.failCount.toString(),
        //     status2: data.skipCount.toString(),
        //     status3: data.totalCount.toString()
        // }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send("svg");
    });
});

jacoco.get("/:job/branch", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, (err, data) => {
        dbg(data);
        // var svg = testBadge({
        //     subject: 'tests',
        //     status1: data.failCount.toString(),
        //     status2: data.skipCount.toString(),
        //     status3: data.totalCount.toString()
        // }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send("svg");
    });
});

jacoco.get("/:job/class", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, (err, data) => {
        dbg(data);
        // var svg = testBadge({
        //     subject: 'tests',
        //     status1: data.failCount.toString(),
        //     status2: data.skipCount.toString(),
        //     status3: data.totalCount.toString()
        // }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send("svg");
    });
});

jacoco.get("/:job/complexity", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, (err, data) => {
        dbg(data);
        // var svg = testBadge({
        //     subject: 'tests',
        //     status1: data.failCount.toString(),
        //     status2: data.skipCount.toString(),
        //     status3: data.totalCount.toString()
        // }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send("svg");
    });
});

jacoco.get("/:job/instruction", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, (err, data) => {
        dbg(data);
        // var svg = testBadge({
        //     subject: 'tests',
        //     status1: data.failCount.toString(),
        //     status2: data.skipCount.toString(),
        //     status3: data.totalCount.toString()
        // }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send("svg");
    });
});

jacoco.get("/:job/line", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, (err, data) => {
        dbg(data);
        // var svg = testBadge({
        //     subject: 'tests',
        //     status1: data.failCount.toString(),
        //     status2: data.skipCount.toString(),
        //     status3: data.totalCount.toString()
        // }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send("svg");
    });
});

jacoco.get("/:job/method", function(req, res) {
    var job = req.params.job;
    jenkins.lastSuccessfulBuildJacocoReport(job, (err, data) => {
        dbg(data);
        // var svg = testBadge({
        //     subject: 'tests',
        //     status1: data.failCount.toString(),
        //     status2: data.skipCount.toString(),
        //     status3: data.totalCount.toString()
        // }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send("svg");
    });
});


module.exports = function(dbg, jenkins) {
    this.dbg = dbg;
    this.jenkins = jenkins
    return jacoco;
};
