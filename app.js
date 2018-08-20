const fs = require('fs');
const readline = require('readline');

let done = new Promise(resolve => {
    readline.createInterface(fs.createReadStream('./config/app.properties'))
        .on('line', line => {
            if (!line.startsWith('#') && !/^ *$/.test(line)) {
                var [key, val] = line.split("=", 2);
                process.env[key] = val;
            }
        })
        .on('close', () => {
            resolve(0);
        });
});

done.then(() => {
    const express = require('express');
    const dbg = require('debug')('app:');
    const https = require('https');
    require('./lib/jenkinsApi').init();
    const app = express();

    const status = require("./api/status");
    app.use("/status", status);
    const custom = require("./api/custom");
    app.use("/custom", custom);
    const testReport = require("./api/testReport");
    app.use("/testReport", testReport);
    const jacoco = require("./api/jacoco");
    app.use("/jacoco", jacoco);

    require('./lib/gitHubApi').init();
    const github = require("./api/github");
    app.use("/github", github);

    const release = require("./api/release");
    app.use('/release', release);

    require('./lib/dockerApi').init();
    const docker = require("./api/docker");
    app.use("/docker", docker);

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


    const sslOptions = {
        key: fs.readFileSync('certs/server.key'),
        cert: fs.readFileSync('certs/server.crt')
    };
    https.createServer(sslOptions, app).listen(process.env.APP_PORT);
    dbg('server started on port %s', process.env.APP_PORT);
});
