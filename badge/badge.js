'use strict';
const colorMap = require('./colorMap');
const stringWidth = require('string-width');
const baseWidth = 7;

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
