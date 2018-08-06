'use strict';
const colorMap = require('./colorMap');

const stringWidth = require('string-width');
const baseWidth = 7;

var defaultOptions = {
    color1 : colorMap.red,
    color2 : colorMap.yellow,
    color3 : colorMap.blue,
};

module.exports = function badge(options, template) {
    let config = Object.assign(defaultOptions, options || {});
    let subjectWidth = stringWidth(config.subject) * baseWidth + 10;
    let status1Width = stringWidth(config.status1) * baseWidth + 10;
    let status2Width = stringWidth(config.status2) * baseWidth + 10;
    let status3Width = stringWidth(config.status3) * baseWidth + 10;
    config.subjectWidth = subjectWidth;
    config.status1Width = status1Width;
    config.status2Width = status2Width;
    config.status3Width = status3Width;
    config.width = subjectWidth + status1Width + status2Width + status3Width;
    return template(config);
};
