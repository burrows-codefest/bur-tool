'use strict';

var fs = require('fs'),
    https = require('https'),
    githubApiUrl = 'api.github.com',
    gitApiHttpsOptions = {
        'hostname': githubApiUrl,
        'headers': {
            'user-agent': 'bur-tool'
        }
    };

exports.execute = function () {
    var installedProjects = fs.readFileSync(__dirname + '/../config.json').projects,
        currentProject = process.cwd();

    if(installedProjects && installedProjects.indexOf(currentProject) !== -1) {
        console.log('ERROR: Project already has githooks installed. use bur update to get the latest version');
        process.exit(1);
    }

    if(!fs.existsSync(currentProject + '/.git')) {
        console.log('ERROR: GIT folder does not exist in this project');
        process.exit(1);
    }

    console.log('checking the latest version of git hooks');

    gitApiHttpsOptions.path = '/repos/burrows-codefest/git-hooks/branches';

    https.get(gitApiHttpsOptions, function (githubResponse) {
        var data = '';

        githubResponse.on('data', function (chunk) {
            data += chunk;
        });

        githubResponse.on('end', function () {
           console.log(data);
            //compare master branch sha to stored value
            //if no match download latest version
            //now push hooks to current project
            //update config.json
        });
    })
}

exports.help = function () {
    console.log("githooks - adds customised git hooks to the current project");
}