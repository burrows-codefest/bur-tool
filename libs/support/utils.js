'use strict';
var fs = require('fs'),
    configPath = __dirname + '/../../config.json';


exports.getConfig = function () {
    return JSON.parse(fs.readFileSync(configPath, {encoding: 'utf8'}));
};

exports.setConfig = function (config) {
    fs.writeFileSync(configPath, JSON.stringify(config));
};