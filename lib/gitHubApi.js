const request = require('./request');

const config = {};
const gitHubApi = {};
gitHubApi.init = function() {
    config.orgName = process.env.GITHUB_ORG_NAME;
}

gitHubApi.getCommitCount = function(repo, callback) {
    request.gitHubGQLPost(`{repository(owner:"${config.orgName}",name:"${repo}"){defaultBranchRef{target{... on Commit{history{totalCount}}}}}}`, callback);
}

module.exports = gitHubApi;
