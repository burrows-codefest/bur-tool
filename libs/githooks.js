'use strict';

var fs = require('fs'),
    supportUtils = require('./support/utils'),
    gitHooksUtils = require('./githooks/utils');

function updateGithooksInProject(commit, currentProject, callback) {
    var config = supportUtils.getConfig();

    gitHooksUtils.copyFilesFromCacheToProject(function () {
        config.cache.githooks = commit;
        config.projects[currentProject] = commit;

        supportUtils.setConfig(config);

        if (callback) {
            callback();
        }
    });
}

exports.execute = function (program) {
    var cachePath = __dirname + '/../cache',
        githooksPath = cachePath + '/githooks',
        config = supportUtils.getConfig(),
        githooksCacheVersion = config.cache.githooks,
        currentProject = process.cwd();

    if (!fs.existsSync(currentProject + '/.git')) {
        console.log('ERROR: GIT folder does not exist in this project');
        process.exit(1);
    }

    console.log('checking the latest version of git hooks');

    gitHooksUtils.getGitHookMasterBranchStatus(function (githubStatus) {
        if (!githooksCacheVersion) {
            if (!fs.existsSync(cachePath)) {
                fs.mkdirSync(cachePath);
            }

            if (!fs.existsSync(githooksPath)) {
                fs.mkdirSync(githooksPath);
            }

            gitHooksUtils.cloneGithooksRepo(function () {
                updateGithooksInProject(githubStatus.commit.sha, currentProject, function () {
                    console.log('git hooks added to this project');
                });
            });

        } else if (githooksCacheVersion !== githubStatus.commit.sha) {
            gitHooksUtils.pullLatestGithooksRepoVersion(function () {
                var project;

                if (program.single) {
                    updateGithooksInProject(githubStatus.commit.sha, currentProject, function () {
                        console.log('git hooks updated for this project');
                    });
                } else {
                    for (project in config.projects) {
                        updateGithooksInProject(githubStatus.commit.sha, project, function () {
                            console.log('git hooks updated for ' + project);
                        });
                    }
                }
            });
        } else {
            console.log('This Project currently has the latest version of git hooks');
            process.exit(0);
        }
    });
};
