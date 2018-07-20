var express = require('express');
var main = express.Router();

main.get("", function(req, res){
    res.send('Main Page Works');
});

module.exports = main;
