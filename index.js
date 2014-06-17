var fs = require('fs'),
	propertiesParser = require('properties').parse,
	buildTypes = ['major', 'minor', 'patch'],

	teamcity = {},
	release = {};

teamcity.setBuildVersion = function setBuildVersion() {
	var pkg = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8')),
		isSnapshot = buildTypes.indexOf(this.getProperty('build.type')) < 0;

	console.log("##teamcity[buildNumber '" + pkg.version + (isSnapshot ? '-snapshot' : '') + " #{build.number}']");
};

teamcity.isCiRun = function isCiRun() {
	return !!process.env.TEAMCITY_VERSION;
};

teamcity.getProperty = function getProperty(name) {
	var file,
		propsJSON,
		result;

	if (teamcity.isCiRun()) {
		file = fs.readFileSync(process.env.TEAMCITY_BUILD_PROPERTIES_FILE, 'utf-8');
		propsJSON = propertiesParser(file);

		result = propsJSON[name]
	}

	if (typeof result === 'undefined') {
		console.log('[WARN]: Property ' + name + ' not defined');
		console.log('[INFO]: Running ' + (teamcity.isCiRun() ? '' : 'NOT ') + 'under TeamCity');
	}

	return result;
};

release.versionBump = function versionBump(type) {
	var pkgFile = process.cwd() + '/package.json',
		pkg = JSON.parse(fs.readFileSync(pkgFile)),
		versionParts = pkg.version.split('.'),
		typePos;

	type = type || '';

	typePos = buildTypes.indexOf(type.toLowerCase());

	if (typePos > -1) {
		versionParts[typePos]++;

		pkg.version = versionParts.join('.');
		fs.writeFileSync(pkgFile, JSON.stringify(pkg, undefined, 4));
	}
};


module.exports = {
	teamcity: teamcity,
	release: release
};
