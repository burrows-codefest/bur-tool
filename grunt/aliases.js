module.exports = function () {
    return {
        default: ['jshint:all', 'mocha-chai-sinon:unit'],
        coverage: ['jshint:all', 'mocha-chai-sinon:coverage']
    }
};