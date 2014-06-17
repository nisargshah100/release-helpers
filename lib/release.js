var fs = require('fs'),
	exec = require('child_process').exec,
	Q = require('q'),
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

function _SVNCommit() {
	var d = Q.defer();

	exec('svn commit -m "[release]"', function(err) {
		if (err) {
			console.log("[WARN] svn commit failed");
		}
		d.resolve();
	});

	return d.promise;
}

function _GITAdd() {
	var d = Q.defer();

	exec('git add package.json bower.json', function(err) {
		d.resolve();
	});

	return d.promise;
}

function _GITCommit() {
	var d = Q.defer();

	exec('git commit -m "[release]"', function(err) {
		if (err) {
			console.log("[WARN] git commit failed");
		}

		d.resolve();
	});

	return d.promise;
}

function _GITPush() {
	var d = Q.defer();

	exec('git push', function(err) {
		if (err) {
			console.log("[WARN] git push failed");
		}

		d.resolve();
	});

	return d.promise;
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

		_SVNCommit()
			.then(_GITAdd)
			.then(_GITCommit)
			.then(_GITPush)
			.then(cb);
	}
}