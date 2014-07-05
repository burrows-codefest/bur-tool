'use strict';

var fs = require('fs');

exports.execute = function () {
    var installedProjects = fs.readFileSync(__dirname + '/../config.json').projects;

    //get current directory
    console.log(process.cwd());
}

exports.help = function () {
    console.log("githooks - adds customised git hooks to the current project");
}