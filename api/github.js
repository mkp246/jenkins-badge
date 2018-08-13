const github = require('express').Router();
const gitHubApi = require('../lib/gitHubApi');
const dbg = require('debug')('api:github:');
const badge = require('../badge/badge');
const normal = require('../badge/template/normal');

github.get("/:repo/commits", (req, res) => {
    let repo = req.params.repo;
    dbg("repo: %s", repo);
    gitHubApi.getCommitCount(repo, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        let json = JSON.parse(data);
        let commits = (getPathOrNull(json, "data.repository.defaultBranchRef.target.history.totalCount") || 0).toString();
        let commitsHuman;
        let commitsLength = commits.length;
        if (commitsLength <= 3) {
            commitsHuman = commits;
        } else if (commits.length <= 6) {
            commitsHuman = commits.substr(0, commitsLength - 3) + "K" + commits.substr(-3);
        } else {
            commitsHuman = commits.substr(0, commitsLength - 6) + "." + commits.substr(-6, 1) + "M" + commits.substr(-5, 2) + "K" + commits.substr(-3);
        }
        let svg = badge({
            subject: 'commits',
            status: commitsHuman,
            color: 'blue',
        }, normal);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

github.get("/:repo/branches", (req, res) => {
    let repo = req.params.repo;
    dbg("repo: %s", repo);
    gitHubApi.getBranchCount(repo, (err, data) => {
        dbg(data);
        let json = JSON.parse(data);
        let branches = (getPathOrNull(json, "data.repository.refs.totalCount") || 0).toString();
        let svg = badge({
            subject: 'branches',
            status: branches,
            color: 'blue',
        }, normal);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

function getPathOrNull(json, path) {
    let paths = path.split('.');
    while ((json != null) && (paths.length > 0)) {
        json = json[paths.shift()];
    }
    return json;
}

module.exports = github;
