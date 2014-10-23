#!/usr/bin/env node

'use strict';

var program = require('commander'),
    gitHooks = require('../libs/githooks'),
    pkgJson = require('../package.json');

program.version(pkgJson.version);

program
    .command('githooks')
    .description('adds customised git hooks to the current project')
    .action(gitHooks.execute);

program.parse(process.argv);
