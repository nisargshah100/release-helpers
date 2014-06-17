var fs = require('fs');

module.exports = {
	readJSON: readJSON,
	writeJSON: writeJSON
};

function readJSON(filename) {
	return JSON.parse(fs.readFileSync(filename, 'utf-8'));
}

function writeJSON(filename, json) {
	var content = JSON.stringify(json, undefined, 4);

	fs.writeFileSync(filename, content);
}
