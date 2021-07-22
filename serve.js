const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const packageJson = require('./package.json');

app.use(express.static(path.join(__dirname, './dist')));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(3000, function(err, res) {
	if (err) {
		console.log(`err to serve ${packageJson.name} build, err: ${err.message}`);
	} else {
		console.log(`${packageJson.name} serve started`);
	}
})
