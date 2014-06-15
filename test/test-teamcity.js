var chai = require('chai'),
	sinon = require('sinon'),
	utils = require('./utils.js');

chai.should();

describe('#teamicty namespace', function() {
	var teamcity;

	beforeEach(function(done) {
		utils.setCase('simple-project', done);
		teamcity = require('../index.js').teamcity;
	});


	afterEach(function(done) {
		teamcity = null;

		utils.restore(done);
	});

	describe('#setBuildVersion', function() {
		it('should print teamcity system message to set build version according package.json through console.log', function() {
			var originalLog = console.log,
				spy;

			spy = sinon.spy();
			console.log = spy;
			teamcity.setBuildVersion();
			console.log = originalLog;

			spy.calledWith("##teamcity[buildNumber '1.3.23 #{build.number}']").should.equal(true);
		});
	});

	describe('#isCiRun', function() {
		it('should return true if env variable TEAMCITY_VERSION presents', function() {
			process.env.TEAMCITY_VERSION = '123';

			teamcity.isCiRun().should.equal(true);
			delete process.env.TEAMCITY_VERSION;

		});
	});
});