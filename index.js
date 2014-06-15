var teamcity = {
	setBuildVersion: function() {
		var pkg = require(process.cwd() + '/package.json');

		console.log("##teamcity[buildNumber '" + pkg.version + " #{build.number}']");
	},

	isCiRun: function() {
		return !!process.env.TEAMCITY_VERSION;
	}
};


module.exports = {
	teamcity: teamcity
};