'use strict';

var colorMap = {
    red: '#e05d44',
    orange: '#fe7d37',
    green: '#97CA00',
    brightgreen: '#4c1',
    yellowgreen: '#a4a61d',
    yellow: '#dfb317',
    lightgrey: '#9f9f9f',
    blue: '#007ec6',
    pink: '#FF1493'
};

var stringWidth = require('string-width');
var baseWidth = 7;

var defaultOptions = {
    subject: '',
    status: '',
    color: 'red'
};

module.exports = function badge(options, template) {
    options = options || {};
    var config = Object.assign(defaultOptions, options);
    var subjectWidth = stringWidth(config.subject) * baseWidth + 10;
    var statusWidth = stringWidth(config.status) * baseWidth + 10;
    config.subjectWidth = subjectWidth;
    config.statusWidth = statusWidth;
    config.width = subjectWidth + statusWidth;
    config.color = colorMap[config.color] || colorMap.yellow;
    config.from = colorMap[config.from] || colorMap.yellow;
    config.to = colorMap[config.to] || colorMap.yellow;
    var svg = template(config);
    return svg;
};
