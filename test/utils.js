var rimraf = require('rimraf'),
	ncp = require('ncp'),

	CASES_FOLDER = './test/cases/';



module.exports = function(folder) {
	return new function() {
		var TMP_FOLDER = './test/' + folder,
			restoreDirName;


		this.setCase = function(caseFolder, cb) {
			var casePath = CASES_FOLDER + caseFolder;

			restoreDirName = process.cwd();

			ncp(casePath, TMP_FOLDER, function() {
				process.chdir(TMP_FOLDER);
				cb();
			});
		};

		this.restore = function(cb) {
			process.chdir(restoreDirName);
			rimraf.sync(TMP_FOLDER);
			cb();
		};
	};
};