var express = require('express');
var status = express.Router();
const Canvas = require('canvas');

status.get("/:job/last", function (req, res) {
    var job = req.params.job;
    dbg("job: %s", job);
    jenkins.lastBuildInfo(job, (err, data)=>{
        var result = data.result;
        dbg(result);
        const canvas = new Canvas(200, 100);
        const ctx = canvas.getContext('2d');
        ctx.font = "30px Arial";
        ctx.fillText(result, 10, 50);
        ctx.stroke();
        res.set('Content-Type', 'image/png');
        res.send(canvas.toBuffer());
    });
});

module.exports = function (dbg, jenkins){
    this.dbg = dbg;
    this.jenkins = jenkins
    return status;
};
