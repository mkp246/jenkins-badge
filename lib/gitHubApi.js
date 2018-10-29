const request = require('./request');
const dbg = require('debug')('lib:gitHubApi:');
const endPointParser = require('./endPointParser');

const config = {};
const gitHubApi = {};
gitHubApi.init = function() {
    [config.host, config.port, config.prefix] = endPointParser(process.env.GITHUB_API_END_POINT);
    config.path = "/" + config.prefix;
    config.headers = {
        "Authorization": "token " + process.env.GITHUB_TOKEN
    };
    config.orgName = process.env.GITHUB_ORG_NAME;
    dbg(config);
}

const types = Object.freeze({
    STATS_CONTRIBUTORS: 0,
});

function buildPath(repo, type) {
    if (type === types.STATS_CONTRIBUTORS) {
        return `${config.path}/repos/${config.orgName}/${repo}/stats/contributors`;
    }
}

gitHubApi.getCommitCount = function(repo, callback) {
    request.gitHubGQLPost(`{repository(owner:"${config.orgName}" name:"${repo}"){defaultBranchRef{target{... on Commit{history{totalCount}}}}}}`, callback);
}

gitHubApi.getBranchCount = function(repo, callback) {
    request.gitHubGQLPost(`{repository(owner:"${config.orgName}" name:"${repo}"){refs(refPrefix:"refs/heads/"){totalCount}}}`, callback);
}

gitHubApi.getTagCount = function(repo, callback) {
    request.gitHubGQLPost(`{repository(owner:"${config.orgName}" name:"${repo}"){refs(refPrefix:"refs/tags/"){totalCount}}}`, callback);
}

gitHubApi.getContributors = function(repo, callback) {
    getGitHub(buildPath(repo, types.STATS_CONTRIBUTORS), callback);
}

gitHubApi.getLegends = gitHubApi.getContributors;

gitHubApi.getPRs = function(repo, callback) {
    request.gitHubGQLPost(`{repository(owner:"${config.orgName}",name:"${repo}"){open:pullRequests(states:[OPEN]){totalCount}closed:pullRequests(states:[CLOSED]){totalCount}merged:pullRequests(states:[MERGED]){totalCount}}}`, callback);
}

gitHubApi.getOpenPRs = function(repo, callback) {
    request.gitHubGQLPost(`{repository(owner:"${config.orgName}",name:"${repo}"){pullRequests(first:10 states:OPEN orderBy:{field:CREATED_AT,direction:DESC}){totalCount nodes{author{login}createdAt number reviews(last:1,states:[APPROVED]){totalCount}commits(last:1){nodes{commit{status{state contexts{state context}}}}}}}}}`, callback);
}

function getGitHub(path, callback) {
    dbg(path);
    request.get(config.host, config.port, path, null, config.headers, callback);
}

module.exports = gitHubApi;
