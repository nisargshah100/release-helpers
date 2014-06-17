var chai = require('chai'),
	fs = require('fs'),
	rimraf = require('rimraf'),
	utils = require('./utils.js')('tmp-release');

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
		it('should update major version if "major" argument provided', function() {
			var pkg;

			release.versionBump("major");

			pkg = require(process.cwd() + '/package.json');

			pkg.version.should.equal('2.3.23');
		});

		it('should update minor version if "minor" argument provided', function() {
			var pkg;

			release.versionBump("minor");

			pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));

			pkg.version.should.equal('1.4.23');
		});

		it('should update patch version if "patch" argument provided', function() {
			var pkg;

			release.versionBump("patch");

			pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));

			pkg.version.should.equal('1.3.24');
		});

		it('should not modify version if type not one of (major, minot, patch)', function() {
			var pkg;

			release.versionBump("qwe");

			pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));
			pkg.version.should.equal('1.3.23');
		});

		it('should not modify version if type not provided', function() {
			var pkg;

			release.versionBump();

			pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));
			pkg.version.should.equal('1.3.23');
		});

		it('should update version in bower.json file', function() {
			var bowerPkg;

			release.versionBump("minor");

			bowerPkg = JSON.parse(fs.readFileSync(process.cwd() + '/bower.json', 'utf-8'));

			bowerPkg.version.should.equal('1.4.23');
		});

		it('should not throw error if project without bower.json', function() {
			rimraf.sync(process.cwd() + '/bower.json');

			function testFunc () {
				release.versionBump('minor');
			}

			testFunc.should.to.not.throw();
		})
	});
});