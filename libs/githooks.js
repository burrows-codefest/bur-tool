'use strict';

var fs = require('fs');

exports.execute = function () {
    var installedProjects = fs.readFileSync(__dirname + '/../config.json').projects,
        currentProject = process.cwd();

    if(installedProjects.indexOf(currentProject) !== -1) {
        console.log('ERROR: Project already has githooks installed. use bur update to get the latest version');
        process.exit(1);
    }

    if(fs.existsSync(currentProject + '/.git')) {
        console.log('ERROR: GIT folder does not exist in this project');
        process.exit(1);
    }

    //get hooks from github

    //add them to git hooks folder

    //add project to the config.json

}

exports.help = function () {
    console.log("githooks - adds customised git hooks to the current project");
}