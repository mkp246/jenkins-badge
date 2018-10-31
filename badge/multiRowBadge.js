'use strict';
const colorMap = require('./colorMap');
const dbg = require('debug')('badge:multiRowBadge:');
const baseWidth = 11;

module.exports = function badge(options, template) {
    options.maxLength = options.len.reduce((item, prev) => item + prev);
    options.maxLength *= baseWidth;
    options.maxLength += ((options.cols - 1) * (baseWidth - 4) * 2);
    options.baseWidth = baseWidth;
    options.colors.forEach((color, index) => {
        if (color) {
            if (typeof color === 'string') options.colors[index] = colorMap[color];
            else {
                Object.keys(color).forEach((key) => color[key] = colorMap[color[key]]);
            }
        }
    });
    options.maxHeight = 19 * options.items.length;
    dbg(options);
    return template(options);
};
