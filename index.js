var fs = require('fs'),
	propertiesParser = require('properties').parse,
	buildTypes = ['major', 'minor', 'patch'],

	teamcity = {};

teamcity.setBuildVersion = function setBuildVersion() {
	var pkg = require(process.cwd() + '/package.json'),
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


module.exports = {
	teamcity: teamcity
};