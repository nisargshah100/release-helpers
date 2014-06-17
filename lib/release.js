var fs = require('fs'),
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

function versionBump(type) {
	_updateVersionInFile('package.json', type);
	_updateVersionInFile('bower.json', type);
}