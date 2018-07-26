const fs = require('fs');

fs.readFileSync('config/app.properties').toString().split('\n').forEach(line => {
    var [key, val] = line.split("=", 2);
    process.env[key] = val;
});

const express = require('express');
const dbg = require('debug')('app');
const https = require('https');
const jenkinsApi = require('./lib/jenkinsApi')(https);
const app = express();

const jenkins = jenkinsApi.init("nnmjenkins.ftc.hpeswlab.net", 8443, "jenkins");

const status = require("./api/status")(dbg, jenkins);
app.use("/status", status);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const sslOptions = {
    key: fs.readFileSync('certs/server.key'),
    cert: fs.readFileSync('certs/server.crt')
};
https.createServer(sslOptions, app).listen(8888);
dbg('server started ...');
