'use strict';
const colorMap = require('./colorMap');
const baseWidth = 11;

module.exports = function badge(options, template) {
    options.maxLength = options.len.reduce((item, prev) => item + prev);
    options.maxLength *= baseWidth;
    options.maxLength += ((options.cols - 1) * (baseWidth - 2) * 2);
    options.baseWidth = baseWidth;
    // let subjectWidth = stringWidth(config.subject) * baseWidth + 10;
    // let status1Width = stringWidth(config.status1) * baseWidth + 10;
    // let status2Width = stringWidth(config.status2) * baseWidth + 10;
    // let status3Width = stringWidth(config.status3) * baseWidth + 10;
    // config.subjectWidth = subjectWidth;
    // config.status1Width = status1Width;
    // config.status2Width = status2Width;
    // config.status3Width = status3Width;
    // config.width = subjectWidth + status1Width + status2Width + status3Width;

    // config.color1 = colorMap[config.color1] || colorMap.red;
    // config.color2 = colorMap[config.color2] || colorMap.yellow;
    // config.color3 = colorMap[config.color3] || colorMap.blue;

    // config.from = colorMap[config.from] || colorMap.yellow;
    // config.to = colorMap[config.to] || colorMap.green;
    return template(options);
};
