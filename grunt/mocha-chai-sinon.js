'use strict';

module.exports = {
    unit: {
        src: ['test/unit/**/*Spec.js'],
        options: {
            ui: 'bdd',
            reporter: 'spec'
        }
    },
    coverage: {
        src: ['test/unit/**/*Spec.js'],
        options: {
            ui: 'bdd',
            reporter: 'html-cov',
            quiet: true,
            filter: [
                '/libs/',
                'bin'
            ],
            captureFile: './coverage.html'
        }
    }
};
