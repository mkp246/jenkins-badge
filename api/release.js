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
        let release = data.actions[0].parameters.filter((val) => {
            return val.name === "MVN_RELEASE_VERSION"
        })[0].value;
        let msAgo = new Date() - data.timestamp - data.duration;
        let daysAgo = Math.floor(msAgo / (86400000));
        let svg = releaseBadge({
            subject: 'released',
            color1: 'blue',
            status1: release,
            status2: daysAgo + " days ago"
        }, releaseTemplate);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

module.exports = release;
