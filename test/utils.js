var rimraf = require('rimraf'),
	ncp = require('ncp'),

	TMP_FOLDER = './test/tmp',
	CASES_FOLDER = './test/cases/',
	restoreDirName,
	utils = {};

utils.setCase = function(caseFolder, cb) {
	var casePath = CASES_FOLDER + caseFolder;

	restoreDirName = process.cwd();

	ncp(casePath, TMP_FOLDER, function() {
		process.chdir(TMP_FOLDER);
		cb();
	});
};

utils.restore = function(cb) {
	process.chdir(restoreDirName);

	rimraf(TMP_FOLDER, function() {
		cb();
	});
};

module.exports = utils;