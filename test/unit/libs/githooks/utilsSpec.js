describe('githooks Utils helper', function () {
    var helper, rewire, fs,
        events;

    before(function () {
        fs = require('fs');
        rewire = require('rewire');
        events = require('events');
    });

    beforeEach(function () {
        helper = rewire('../../../../libs/githooks/utils');
    });

    it('should not be undefined', function () {
        expect(helper).to.be.ok;
    });

    describe('getGitHookMasterBranchStatus function', function () {
        it('should return back the branch status for the master branch', function () {
            var mockHttpResponse = undefined,
                callbackSpy = sinon.spy(),
                mockGithubData = fs.readFileSync(__dirname + '/../../../data/github-branch.json'),
                httpMockGet = sinon.spy(function (url, callback) {
                    mockHttpResponse = new events.EventEmitter();
                    callback(mockHttpResponse);
                });

            helper.__set__('https.get', httpMockGet);

            helper.getGitHookMasterBranchStatus(callbackSpy);
            mockHttpResponse.emit('data', mockGithubData);
            mockHttpResponse.emit('end');

            expect(httpMockGet.calledOnce).to.be.ok;
            expect(callbackSpy.calledOnce).to.be.ok;
        });
    });

    describe('cloneGithooksRepo function', function () {
        it('should run git clone and successfully clone the repo', function () {
            var mockExec = function (command, callback) {
                    callback(null);
                },
                callbackSpy = sinon.spy();

            helper.__set__('exec', mockExec);

            helper.cloneGithooksRepo(callbackSpy);

            expect(callbackSpy.calledOnce).to.be.ok;
        });

        it('should run git clone and fails clone the repo', function (done) {
            var mockExec = function (command, callback) {
                    callback({});
                },
                realExec = helper.__get__('exec'),
                realExit = helper.__get__('process.exit'),
                processExitSpy = sinon.spy(done()),
                callbackSpy = sinon.spy();

            helper.__set__('exec', mockExec);
            helper.__set__('process.exit', processExitSpy);

            helper.cloneGithooksRepo(callbackSpy);

            expect(processExitSpy.calledOnce).to.be.ok;
            expect(processExitSpy.args[0][0]).to.equal(1);

            helper.__set__('exec', realExec);
            helper.__set__('process.exit', realExit);
        });
    });

    describe('copyFilesFromCacheToProject function', function () {
        it('should copy cache to selected project successfully', function () {
            var mockNcp = function (src, dest, callback) {
                    callback(null);
                },
                callbackSpy = sinon.spy();

            helper.__set__('ncp', mockNcp);

            helper.copyFilesFromCacheToProject(callbackSpy);

            expect(callbackSpy.calledOnce).to.be.ok;
        });

        it('should copy cache to selected project and fail', function (done) {
            var mockNcp = function (src, dest, callback) {
                    callback({});
                },
                realExec = helper.__get__('exec'),
                realExit = helper.__get__('process.exit'),
                processExitSpy = sinon.spy(done()),
                callbackSpy = sinon.spy();

            helper.__set__('ncp', mockNcp);
            helper.__set__('process.exit', processExitSpy);

            helper.copyFilesFromCacheToProject(callbackSpy);

            expect(processExitSpy.calledOnce).to.be.ok;
            expect(processExitSpy.args[0][0]).to.equal(1);

            helper.__set__('exec', realExec);
            helper.__set__('process.exit', realExit);
        });
    });

    describe('pullLatestGithooksRepoVersion function', function () {
        it('should run git pull and successfully pull the latest repo', function () {
            var mockExec = function (command, callback) {
                    callback(null);
                },
                callbackSpy = sinon.spy();

            helper.__set__('exec', mockExec);

            helper.cloneGithooksRepo(callbackSpy);

            expect(callbackSpy.calledOnce).to.be.ok;
        });

        it('should run git pull and fails to pull the repo', function (done) {
            var mockExec = function (command, callback) {
                    callback({});
                },
                realExec = helper.__get__('exec'),
                realExit = helper.__get__('process.exit'),
                processExitSpy = sinon.spy(done()),
                callbackSpy = sinon.spy();

            helper.__set__('exec', mockExec);
            helper.__set__('process.exit', processExitSpy);

            helper.cloneGithooksRepo(callbackSpy);

            expect(processExitSpy.calledOnce).to.be.ok;
            expect(processExitSpy.args[0][0]).to.equal(1);

            helper.__set__('exec', realExec);
            helper.__set__('process.exit', realExit);
        });
    });
});