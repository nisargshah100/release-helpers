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

		for (var i = typePos + 1; i < 3; i++) {
			versionParts[i] = 0;
		}

		json.version = versionParts.join('.');
		utils.writeJSON(filePath, json);
	}

}

function versionBump(type, cb) {
	var isValidType = buildTypes.indexOf(type) > -1;

	if (!isValidType) {
		console.log('[WARN] release type not provided');

		if (typeof type === 'function') {
			type();
		} else {
			cb();
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