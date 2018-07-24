const fs = require('fs');

fs.readFileSync('config/app.properties').toString().split('\n').forEach(line => {
    keyVal = line.split("=", 2);
    process.env[keyVal[0]] = keyVal[1];
});

const express = require('express');
const dbg = require('debug')('app');
const jenkinsapi = require('jenkins-api');
const https = require('https');
const app = express();

const jenkins = jenkinsapi.init("https://nnmjenkins.ftc.hpeswlab.net:8443/jenkins");

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
