module.exports.init = function(jenkinsUrl) {
    var jenkinsUrl = jenkinsUrl;

    //this object will be returned
    var jenkins = {};
    jenkins.lastBuildInfo = function(job, callback) {
        
    };

    return jenkins;
};
