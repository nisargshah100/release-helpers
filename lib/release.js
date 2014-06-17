var fs = require('fs'),
	exec = require('child_process').exec,
	utils = require('./utils'),
	buildTypes = ['major', 'minor', 'patch'];

module.exports = {
	versionBump: versionBump
};

function _updateVersionInFile(file, type) {
	var filePath = process.cwd() + '/' + file,
		json,
		versionParts,
		typePos;

	if (fs.existsSync(filePath)) {
		json = utils.readJSON(filePath);
		versionParts = json.version.split('.');

		type = type || '';

		typePos = buildTypes.indexOf(type.toLowerCase());
	}

	if (typePos > -1) {
		versionParts[typePos]++;

		json.version = versionParts.join('.');
		utils.writeJSON(filePath, json);
	}

}

function versionBump(type, cb) {
	if (typeof type === 'function' || !type) {
		console.log('[WARN] release type not provided');

		if (!type) {
			cb();
		} else {
			type();
		}
	} else {
		_updateVersionInFile('package.json', type);
		_updateVersionInFile('bower.json', type);

		exec('svn commit -m "[release]"', function(err) {
			if (err) {
				console.log("[WARN] commit failed");
			}
			cb();
		});
	}
}