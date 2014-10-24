#!/usr/bin/env node

'use strict';

var program = require('commander'),
    gitHooks = require('../libs/githooks'),
    pkgJson = require('../package.json');

program.version(pkgJson.version);

program
    .command('githooks')
    .description('adds customised git hooks to the current project')
    .option('-s, --single', 'update only this project')
    .action(gitHooks.execute);

program.parse(process.argv);
