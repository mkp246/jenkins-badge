const release = require('express').Router();
const jenkins = require("../lib/jenkinsApi");
const releaseTemplate = require("../badge/template/release");
const releaseBadge = require("../badge/releaseBadge");
const dbg = require("debug")('api:release:');

release.get("/:job", (req, res) => {
    let job = req.params.job;
    jenkins.lastRelease(job, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        let release = data.match(/<value>(.*)<\/value>/m)[1];
        let timestamp = data.match(/<timestamp>(.*)<\/timestamp>/m)[1];
        let duration = data.match(/<duration>(.*)<\/duration>/m)[1];
        let days = (new Date() - timestamp - duration) / (86400000);
        let daysAgo = Math.floor(days);
        let hoursAgo = Math.floor((days % 1) * 24);
        dbg(hoursAgo);
        let svg = releaseBadge({
            subject: 'released',
            color1: 'blue',
            status1: release,
            status2: `${daysAgo}d ${hoursAgo}hr ago`
        }, releaseTemplate);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

release.get("/:job/r", (req, res) => {
    let job = req.params.job;
    jenkins.releaseBuildRunning(job, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        let isRelease = data.match(/<value>(.*)<\/value>/m) != null;
        let isRunning = data.match(/<building>(.*)<\/building>/m)[1] == "true";
        res.set('Content-Type', 'image/svg+xml');
        res.send(`release ${isRelease}, running ${isRunning}`);
    });
})

module.exports = release;
