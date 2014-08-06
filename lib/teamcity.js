var fs = require('fs'),
	utils = require('./utils'),
	propertiesParser = require('properties').parse;

module.exports = {
	setBuildVersion: setBuildVersion,
	isCiRun: isCiRun,
	getProperty: getProperty
};

function setBuildVersion() {
	var pkg = utils.readJSON(process.cwd() + '/package.json', 'utf-8'),
		isRelease = !!getProperty('release.type'),
		message = [
			"##teamcity[buildNumber '",
			pkg.version + (isRelease ? "" : "{build.number}"),
			"']"
		];

	console.log(message.join(''));
	setUIPackageVersion(pkg.version, isRelease);
}

function setUIPackageVersion(pkgVersion, isRelease) {
	var version = pkgVersion + (isRelease ? '' : '-SNAPSHOT'),
		message = "##teamcity[setParameter name='system.ui.version' value='" + version + "']";

	console.log(message);
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
		console.log('[INFO]: Running ' + (isCiRun() ? '' : 'NOT ') + 'under TeamCity');
	}

	return result;
}