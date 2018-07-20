const express = require('express');
const dbg = require('debug')('app');
const app = express();
const jenkinsapi = require('jenkins-api');
const https = require('https');
const fs = require('fs');

var jenkins = jenkinsapi.init("https://nnmjenkins.ftc.hpeswlab.net:8443/jenkins");

var status = require("./status")(dbg, jenkins);
app.use("/status", status);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var sslOptions = {
    key: fs.readFileSync('certs/server.key'),
    cert: fs.readFileSync('certs/server.crt')
};
https.createServer(sslOptions, app).listen(8888);
dbg('server started ...');
