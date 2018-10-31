const github = require('express').Router();
const gitHubApi = require('../lib/gitHubApi');
const dbg = require('debug')('api:github:');
const badge = require('../badge/badge');
const normal = require('../badge/template/normal');

const testBadge = require('../badge/testBadge');
const test = require('../badge/template/test');

const multiRowBadge = require('../badge/multiRowBadge');
const multRow = require('../badge/template/multRow');

const config = {};
config.legendsExclude = {};
process.env.LEGENDS_EXCLUDE.split(',').forEach(val => {
    config.legendsExclude[val] = 0;
});
dbg(config);

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

github.get("/:repo/tags", (req, res) => {
    let repo = req.params.repo;
    dbg("repo: %s", repo);
    gitHubApi.getTagCount(repo, (err, data) => {
        dbg(data);
        let json = JSON.parse(data);
        let tags = (getPathOrNull(json, "data.repository.refs.totalCount") || 0).toString();
        let svg = badge({
            subject: 'tags',
            status: tags,
            color: 'blue',
        }, normal);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

github.get("/:repo/contributors", (req, res) => {
    let repo = req.params.repo;
    dbg("repo: %s", repo);
    gitHubApi.getContributors(repo, (err, data) => {
        data = JSON.parse(data);
        let contributorCount = data.length.toString();
        let svg = badge({
            subject: 'contributors',
            status: contributorCount,
            color: 'blue',
        }, normal);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

github.get("/:repo/legends", (req, res) => {
    let repo = req.params.repo;
    dbg("repo: %s", repo);
    gitHubApi.getLegends(repo, (err, data) => {
        data = JSON.parse(data);
        data = data.slice(-5);
        let legends = [];
        let dataLength = data.length - 1;
        for (let index = dataLength; index > -1; index--) {
            let login = data[index].author.login;
            if (!(login in config.legendsExclude)) legends.push(login);
        }
        dbg(legends);
        let svg = testBadge({
            subject: 'legends',
            status1: legends[0] || "N/A",
            color1: 'blue',
            status2: legends[1] || "N/A",
            color2: 'yellow',
            status3: legends[2] || "N/A",
            color3: 'red',
        }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

github.get("/:repo/prs", (req, res) => {
    let repo = req.params.repo;
    dbg("repo: %s", repo);
    gitHubApi.getPRs(repo, (err, data) => {
        dbg(data);
        data = JSON.parse(data);
        let svg = testBadge({
            subject: 'prs',
            status1: (getPathOrNull(data, 'data.repository.open.totalCount') || 0).toString(),
            status2: (getPathOrNull(data, 'data.repository.closed.totalCount') || 0).toString(),
            status3: (getPathOrNull(data, 'data.repository.merged.totalCount') || 0).toString(),
            color1: 'ghGreen',
            color2: 'ghRed',
            color3: 'ghBlue',
        }, test);
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
})

github.get("/:repo/openprs", (req, res) => {
    let repo = req.params.repo;
    dbg("repo: %s", repo);
    gitHubApi.getOpenPRs(repo, (err, data) => {
        data = JSON.parse(data);
        prData = {
            cols: 6,
            items: [],
            colors: ['', 'blue', 'pink', {
                    'SUCCESS': 'ghGreen',
                    'PENDING': 'yellow',
                    'FAILURE': 'red',
                    'N/A': 'yellow'
                },
                {
                    'SUCCESS': 'ghGreen',
                    'ERROR': 'red',
                    'N/A': 'yellow'
                },
                {
                    'true': 'ghGreen',
                    'false': 'red'
                }
            ],
            len: [5, -1, 13, 7, 7, 5]
        };
        data.data.repository.pullRequests.nodes.forEach((pr) => {
            if (pr.commits.nodes[0].commit.status) {
                var jenkins = pr.commits.nodes[0].commit.status.contexts.filter((context) => {
                    return context.context == 'Jenkins Bot'
                })[0];
                var sonar = pr.commits.nodes[0].commit.status.contexts.filter((context) => {
                    return context.context == 'sonarqube'
                })[0];
                jenkins = jenkins ? jenkins.state : 'N/A';
                sonar = sonar ? sonar.state : 'N/A';
            } else {
                jenkins = 'N/A';
                sonar = 'N/A';
            }

            let seconds = Math.floor((new Date() - new Date(pr.createdAt)) / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);
            hours = hours - (days * 24);
            minutes = minutes - (days * 24 * 60) - (hours * 60);
            let ago = `${days}d${hours}h${minutes}m ago`

            item = ['#' + pr.number, pr.author.login, ago, jenkins, sonar, pr.reviews.totalCount > 0]
            if (item[1].length > prData.len[1]) prData.len[1] = item[1].length;
            prData.items.push(item);
        });
        dbg(prData);
        let svg = multiRowBadge(prData, multRow);
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
