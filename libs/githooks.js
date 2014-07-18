'use strict';

var fs = require('fs'),
    supportUtils = require('./support/utils'),
    gitHooksUtils = require('./githooks/utils');

exports.execute = function () {
    var cachePath = __dirname + '/../cache',
        githooksPath = cachePath + '/githooks',
        config = supportUtils.getConfig(),
        installedProjects = config.projects,
        githooksCacheVersion = config.cache.githooks,
        currentProject = process.cwd();

    if (installedProjects && Object.keys(installedProjects).indexOf(currentProject) !== -1) {
        console.log('ERROR: Project already has githooks installed. use bur update to get the latest version');
        process.exit(1);
    }

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
                gitHooksUtils.copyFilesFromCacheToProject(function () {
                    config.cache.githooks = githubStatus.commit.sha;
                    config.projects[currentProject] = githubStatus.commit.sha;

                    supportUtils.setConfig(config);

                    console.log('git hooks added to this project');
                });
            });

        } else if (githooksCacheVersion !== githubStatus.commit.sha) {
            gitHooksUtils.pullLatestGithooksRepoVersion(function () {
                gitHooksUtils.copyFilesFromCacheToProject(function () {
                    config.cache.githooks = githubStatus.commit.sha;
                    config.projects[currentProject] = githubStatus.commit.sha;

                    supportUtils.setConfig(config);

                    console.log('git hooks updated for this project');
                });
            });
        } else {
            console.log('This Project currently has the latest version of git hooks');
            process.exit(0);
        }
    });
};

exports.help = function () {
    console.log('githooks - adds customised git hooks to the current project');
};