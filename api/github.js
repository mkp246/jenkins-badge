const github = require('express').Router();
const gitHubApi = require('../lib/gitHubApi');
const dbg = require('debug')('api:github:');
const badge = require('../badge/badge');
const noraml = require('../badge/template/normal');

github.get("/:repo/commits", function(req, res) {
    let repo = req.params.repo;
    dbg("repo: %s", repo);
    gitHubApi.getCommitCount(repo, (err, data) => {
        dbg(data);
        let json = JSON.parse(data);
        let svg = badge({
            subject: 'commits',
            status: (getPathOrNull(json, "json.data.repository.defaultBranchRef.target.history.totalCount") || 0).toString(),
            color: 'blue',
        }, noraml);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

function getPathOrNull(json, path) {
    let paths = path.split('.');
    while ((json != null) && (paths.length > 0)) {
        dbg(json);
        json = json[paths.shift()];
    }
    dbg("path value: %s", json);
    return json;
}

module.exports = github;
