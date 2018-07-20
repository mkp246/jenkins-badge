var express = require('express');
var canvas = require('canvas');

var app = express();

app.listen(8888);

var main  = require("./main")

app.use("/main", main);

console.log('server started ...');
