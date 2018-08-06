const fs = require('fs');
const readline = require('readline');

let done = new Promise(resolve => {
    readline.createInterface(fs.createReadStream('./config/app.properties'))
        .on('line', line => {
            var [key, val] = line.split("=", 2);
            process.env[key] = val;
        })
        .on('close', () => {
            resolve(0);
        });
});
done.then(() => {
    const express = require('express');
    const dbg = require('debug')('app');
    const https = require('https');
    const jenkinsApi = require('./lib/jenkinsApi')(https);
    const app = express();

    const jenkins = jenkinsApi.init();

    const status = require("./api/status")(dbg, jenkins);
    app.use("/status", status);
    const custom = require("./api/custom");
    app.use("/custom", custom);
    const testReport = require("./api/testReport");
    app.use("/testReport", testReport);

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
});
