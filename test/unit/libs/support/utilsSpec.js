describe('Support Utils helper', function () {
   var helper, rewire;

    before(function () {
       rewire = require('rewire');
    });

    beforeEach(function () {
       helper = rewire('../../../../libs/support/utils');
    });

    it('should not be undefined', function () {
       expect(helper).to.be.ok;
    });

    describe('getConfig function', function () {
        it('should get config from config.json', function () {
           var config = helper.getConfig();

            expect(config.projects).to.be.ok;
        });
    });

    describe('setConfig function', function () {
        it('should get config from config.json', function () {
          var fsWriteMock = sinon.spy();

            helper.__set__('fs.writeFileSync', fsWriteMock);

            helper.setConfig({test: true});

            expect(fsWriteMock.calledOnce).to.be.ok;
        });
    })
});