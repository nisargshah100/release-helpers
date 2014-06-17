var chai = require('chai'),
	fs = require('fs'),
	rimraf = require('rimraf'),
	utils = require('./utils.js');

chai.should();

describe('#release namespace', function() {
	var release;

	beforeEach(function(done) {
		utils.setCase('simple-project', done);
		release = require('../index.js').release;
	});


	afterEach(function(done) {
		release = null;

		utils.restore(done);
	});

	describe('#versionBump', function() {
		it('should update major version if "major" argument provided', function(done) {

			release.versionBump("major", function() {
				var pkg = require(process.cwd() + '/package.json');

				pkg.version.should.equal('2.3.23');
				done();
			});
		});

		it('should update minor version if "minor" argument provided', function(done) {
			release.versionBump("minor", function() {
				var pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));

				pkg.version.should.equal('1.4.23');
				done();
			});
		});

		it('should update patch version if "patch" argument provided', function(done) {
			release.versionBump("patch", function() {
				var pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));

				pkg.version.should.equal('1.3.24');
				done();
			});
		});

		it('should not modify version if type not one of (major, minot, patch)', function(done) {

			release.versionBump("qwe", function() {
				var pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));
				pkg.version.should.equal('1.3.23');
				done();
			});
		});

		it('should not modify version if type not provided', function(done) {

			release.versionBump(function() {
				var pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));
				pkg.version.should.equal('1.3.23');
				done();
			});
		});

		it('should update version in bower.json file', function(done) {

			release.versionBump("minor", function() {
				var bowerPkg = JSON.parse(fs.readFileSync(process.cwd() + '/bower.json', 'utf-8'));

				bowerPkg.version.should.equal('1.4.23');
				done();
			});
		});

		it('should not throw error if project without bower.json', function(done) {
			rimraf.sync(process.cwd() + '/bower.json');

			function testFunc () {
				release.versionBump('minor', function() {
					done();
				});
			}

			testFunc.should.to.not.throw();
		});
	});
});