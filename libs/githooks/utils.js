'use strict';

var https = require('https'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
    exec = require('child_process').exec,
    githooksRepo = 'https://github.com/burrows-codefest/git-hooks.git',
    githooksPath = __dirname + '/../../cache/githooks',
    currentProject = process.cwd(),
    gitApiHttpsOptions = {
        'hostname': 'api.github.com',
        'path': '/repos/burrows-codefest/git-hooks/branches',
        'headers': {
            'user-agent': 'bur-tool'
        }
    };

exports.getGitHookMasterBranchStatus = function (callback) {
    https.get(gitApiHttpsOptions, function (githubResponse) {
        var data = '';

        githubResponse.on('data', function (chunk) {
            data += chunk;
        });

        githubResponse.on('end', function () {
            var githubProjectData;

            data = JSON.parse(data);
            githubProjectData = data.filter(function (item) {
                return item.name === 'master';
            })[0];

            callback(githubProjectData);
        });
    });
};

exports.cloneGithooksRepo = function (callback) {
    exec('git clone -b master ' + githooksRepo + ' ' + githooksPath,
        function (error) {
            if (error) {
                console.log('ERROR: GIT Clone failed - ' + error);
                process.exit(1);
            }

            if (!fs.existsSync(currentProject + '/.git/hooks')) {
                fs.mkdirSync(currentProject + '/.git/hooks');
            }
            callback();
        });
};

exports.copyFilesFromCacheToProject = function (callback) {
    ncp(githooksPath + '/node', currentProject + '/.git/hooks', function (err) {
        if (err) {
            console.log('ERROR: File Copy failed - ' + err);
            process.exit(1);
        }

        callback();
    });
};

exports.pullLatestGithooksRepoVersion = function (callback) {
    var gitDirectory = githooksPath + '/.git';

    exec('git --git-dir=' + gitDirectory + ' --work-tree=' + githooksPath + ' pull origin master', function (error) {
        if (error) {
            console.log('ERROR: GIT Clone failed - ' + error);
            process.exit(1);
        }

        callback();
    });
};