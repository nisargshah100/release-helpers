var fs = require('fs'),
	utils = require('./utils'),
	propertiesParser = require('properties').parse;

module.exports = {
	setBuildVersion: setBuildVersion,
	isCiRun: isCiRun,
	getProperty: getProperty
};

function setBuildVersion() {
	var pkg = utils.readJSON(process.cwd() + '/package.json', 'utf-8');

	console.log("##teamcity[buildNumber '" + pkg.version + "{build.number}']");
}

function isCiRun() {
	return !!process.env.TEAMCITY_VERSION;
}

function getProperty(name) {
	var file,
		propsJSON,
		result;

	if (isCiRun()) {
		file = fs.readFileSync(process.env.TEAMCITY_BUILD_PROPERTIES_FILE, 'utf-8');
		propsJSON = propertiesParser(file);

		result = propsJSON[name]
	}

	if (typeof result === 'undefined') {
		console.log('[WARN]: Property ' + name + ' not defined');
		console.log('[INFO]: Running ' + (teamcity.isCiRun() ? '' : 'NOT ') + 'under TeamCity');
	}

	return result;
}