const github = require('express').Router();
const gitHubApi = require('../lib/gitHubApi');
const dbg = require('debug')('api:github:');
const badge = require('../badge/badge');
const normal = require('../badge/template/normal');

github.get("/:repo/commits", function(req, res) {
    let repo = req.params.repo;
    dbg("repo: %s", repo);
    gitHubApi.getCommitCount(repo, (err, data) => {
        if (err != null) {
            res.sendStatus(503);
            return;
        }
        dbg(data);
        let json = JSON.parse(data);
        let svg = badge({
            subject: 'commits',
            status: (getPathOrNull(json, "data.repository.defaultBranchRef.target.history.totalCount") || 0).toString(),
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
