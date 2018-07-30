var express = require('express');
var status = express.Router();
const badge = require('./badge');

status.get("/:job/last", function(req, res) {
    var job = req.params.job;
    dbg("job: %s", job);
    jenkins.lastBuildInfo(job, (err, data) => {
        var result = data.result;
        dbg(result);
        let color = (result == 'SUCCESS') ? 'green' : 'red';
        var svg = badge({
            subject: 'last',
            status: result,
            color: color
        });
        res.set('Content-Type', 'image/svg+xml');
        res.send(svg);
    });
});

module.exports = function(dbg, jenkins) {
    this.dbg = dbg;
    this.jenkins = jenkins
    return status;
};
