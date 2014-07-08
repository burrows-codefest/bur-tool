'use strict';

var fs = require('fs'),
    https = require('https'),
    ncp = require('ncp').ncp,
    exec = require('child_process').exec,
    githubApiUrl = 'api.github.com',
    gitApiHttpsOptions = {
        'hostname': githubApiUrl,
        'headers': {
            'user-agent': 'bur-tool'
        }
    };

exports.execute = function () {
    var githubProjectData,
        cachePath = __dirname + '/../cache',
        githooksPath = cachePath + '/githooks',
        config = JSON.parse(fs.readFileSync(__dirname + '/../config.json', {encoding: 'utf8'})),
        installedProjects = config.projects,
        githooksCacheVersion = config.cache.githooks,
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
            data = JSON.parse(data);
            githubProjectData = data.filter(function (item) {
                return item.name === 'master';
            })[0];

            if(!githooksCacheVersion) {
                if(!fs.existsSync(cachePath)) {
                    fs.mkdirSync(cachePath);
                }

                if(!fs.existsSync(githooksPath)) {
                    fs.mkdirSync(githooksPath);
                }

                exec('git clone -b master https://github.com/burrows-codefest/git-hooks.git ' + githooksPath,
                function (error) {
                    if (error) {
                        console.log('ERROR: GIT Clone failed - ' + error);
                        process.exit(1);
                    }

                    if(!fs.existsSync(currentProject + '/.git/hooks')) {
                        fs.mkdirSync(currentProject + '/.git/hooks');
                    }

                    ncp(githooksPath + '/hooks', currentProject + '/.git/hooks', function (err) {
                        if (err) {
                            console.log('ERROR: File Copy failed - ' + err);
                            process.exit(1);
                        }

                        config.cache.githooks = githubProjectData.commit.sha;
                        config.projects[currentProject] = githubProjectData.commit.sha;
                        console.log('git hooks updated for this project');
                    });
                });

            } else if (githooksCacheVersion !== githubProjectData.commit.sha) {
                //git pull project
            } else {
                console.log('This Project currently has the latest version of git hooks');
                process.exit(0);
            }
        });
    });

    //add project to the config.json

}

exports.help = function () {
    console.log("githooks - adds customised git hooks to the current project");
}