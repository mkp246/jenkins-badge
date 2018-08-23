const sonar = require('express').Router();
const sonarApi = require("../lib/sonarApi");
const normal = require("../badge/template/normal");
const badge = require("../badge/badge");
const dbg = require("debug")('api:sonar:');

const metrics = Object.freeze({
    BUGS: 'bugs',
    REL_RATING: 'reliability_rating',
    REL_REMEDIATION_EFFORT: 'reliability_remediation_effort',
    VULNERABILITIES: 'vulnerabilities',
    SEC_RATING: 'security_rating',
    SEC_REMEDIATION_EFFORT: 'security_remediation_effort',
});

const ratings = '0ABCDE';

sonar.get("/:componentKey/bugs", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.BUGS, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        sendBadge('bugs', data.component.measures[0].value, res);
    });
});

sonar.get("/:componentKey/relRating", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.REL_RATING, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let rating = parseInt(data.component.measures[0].value);
        rating = ratings[rating];
        sendBadge('reliabilty rating', rating, res);
    });
});

sonar.get("/:componentKey/relEffort", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.REL_REMEDIATION_EFFORT, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let rating = parseInt(data.component.measures[0].value);
        sendBadge('reliabilty effort', minutesToDays(rating), res);
    });
});

sonar.get("/:componentKey/vulnerabilities", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.VULNERABILITIES, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        sendBadge('vulnerabilities', data.component.measures[0].value, res);
    });
});

sonar.get("/:componentKey/secRating", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.SEC_RATING, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let rating = parseInt(data.component.measures[0].value);
        rating = ratings[rating];
        sendBadge('security rating', rating, res);
    });
});

sonar.get("/:componentKey/secEffort", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.SEC_REMEDIATION_EFFORT, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let rating = parseInt(data.component.measures[0].value);
        sendBadge('security effort', minutesToDays(rating), res);
    });
});

function sendBadge(subject, status, res) {
    let svg = badge({
        subject: subject,
        status: status,
        color: 'blue',
    }, normal);
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
}

function minutesToDays(minutes) {
    minutes = minutes / 480; //minutes -> day  (8hr/day)
    return `${Math.floor(minutes)}d ${((minutes%1)*8).toFixed(0)}h`; //Ad Bh format
}
module.exports = sonar;
