'use strict';

var fs = require('fs');

exports.execute = function () {
    // for each file on libs call the help function within them
    fs.readdir(__dirname, function (err, files) {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        console.log('\n================\nBurrows Commandline Tool \n================\n' +
            'add any of the following after the bur command to run:\n');

        files.forEach(function (file) {
            var command = require(__dirname + '/' + file);

            command.help();
        });

        console.log('');

        process.exit(0);
    });
}

exports.help = function () {
    console.log("help - shows all available commands");
}