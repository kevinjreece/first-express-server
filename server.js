var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
var options = {
	host: '127.0.0.1',
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.cert')
}
app.use('/', express.static('./html', {maxAge: 60*60*1000}));
app.listen(80);
