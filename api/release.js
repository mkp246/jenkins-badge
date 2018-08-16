const release = require('express').Router();
const jenkins = require("../lib/jenkinsApi");
const releaseTemplate = require("../badge/template/release");
const releaseBadge = require("../badge/releaseBadge");
const dbg = require("debug")('api:release:');

release.get("/:job", (req, res) => {
    let job = req.params.job;
    Promise.all([new Promise((resolve) => {
        jenkins.lastRelease(job, (err, data) => {
            resolve({
                err,
                data
            });
        });
    }), new Promise((resolve) => {
        jenkins.releaseBuildRunning(job, (err, data) => {
            resolve({
                err,
                data
            });
        })
    })]).
    then(values => {
        dbg(values);
        if ((values[0].err != null) || (values[1].err != null)) {
            res.sendStatus(503);
            return;
        }
        let data1 = values[0].data;
        let release = data1.match(/<value>(.*)<\/value>/m)[1];
        let timestamp = data1.match(/<timestamp>(.*)<\/timestamp>/m)[1];
        let duration = data1.match(/<duration>(.*)<\/duration>/m)[1];
        let days = (new Date() - timestamp - duration) / (86400000);
        let daysAgo = Math.floor(days);
        let hoursAgo = Math.floor((days % 1) * 24);

        let data2 = values[1].data;
        let isRelease = data2.match(/<value>(.*)<\/value>/m) != null;
        let isRunning = data2.match(/<building>(.*)<\/building>/m)[1] == "true";
        let colorTo = 'blue';
        if (isRelease && isRunning) colorTo = 'green'; //a release build is running

        let svg = releaseBadge({
            subject: 'released',
            color1: 'blue',
            to: colorTo,
            status1: release,
            status2: `${daysAgo}d ${hoursAgo}hr ago`
        }, releaseTemplate);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

module.exports = release;
