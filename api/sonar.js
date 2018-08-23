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
    CODE_SMELLS: 'code_smells',
    DEBT: 'sqale_index',
    DEBT_RATIO: 'sqale_debt_ratio',
    MAINT_RATING: 'sqale_debt_ratio',
    MAINT_EFFORT: 'effort_to_reach_maintainability_rating_a',
    DUPL_DENSITY: 'duplicated_lines_density',
    DUPL_LINES: 'duplicated_lines',
    DUPL_BLOCKS: 'duplicated_blocks',
    DUPL_FILES: 'duplicated_files',
});

const ratings = '0ABCDE';

//reliablity
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

//security
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

//maintainibility
sonar.get("/:componentKey/codeSmells", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.CODE_SMELLS, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        sendBadge('code smells', data.component.measures[0].value, res);
    });
});

sonar.get("/:componentKey/debt", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.DEBT, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let debt = parseInt(data.component.measures[0].value);
        sendBadge('debt', minutesToDays(debt), res);
    });
});

sonar.get("/:componentKey/debtRatio", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.DEBT_RATIO, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let debtRatio = data.component.measures[0].value + '%';
        sendBadge('debt ratio', debtRatio, res);
    });
});

sonar.get("/:componentKey/maintRating", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.MAINT_RATING, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let debtRatio = parseInt(data.component.measures[0].value);
        sendBadge('maintainability rating', getMaintRating(debtRatio), res);
    });
});

sonar.get("/:componentKey/maintEffort", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.MAINT_EFFORT, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let effort = parseInt(data.component.measures[0].value);
        sendBadge('maintainability effort', minutesToDays(effort), res);
    });
});

//duplications
sonar.get("/:componentKey/duplDensity", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.DUPL_DENSITY, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let status = data.component.measures[0].value + '%';
        sendBadge('duplicate density', status, res);
    });
});

sonar.get("/:componentKey/duplLines", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.DUPL_LINES, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let status = data.component.measures[0].value;
        sendBadge('duplicate lines', status, res);
    });
});

sonar.get("/:componentKey/duplBlocks", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.DUPL_BLOCKS, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let status = data.component.measures[0].value;
        sendBadge('duplicate blocks', status, res);
    });
});

sonar.get("/:componentKey/duplFiles", (req, res) => {
    let compKey = req.params.componentKey;
    dbg(compKey);
    sonarApi.getMeasure(compKey, metrics.DUPL_FILES, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        data = JSON.parse(data);
        let status = data.component.measures[0].value;
        sendBadge('duplicate files', status, res);
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

function getMaintRating(debtRatio) {
    let maintRating = '';
    if (debtRatio <= 5) {
        maintRating = 'A';
    } else if (debtRatio <= 10) {
        maintRating = 'B';
    } else if (debtRatio <= 20) {
        maintRating = 'C';
    } else if (debtRatio <= 50) {
        maintRating = 'D';
    } else {
        maintRating = 'E';
    }
    return maintRating;
}

module.exports = sonar;
