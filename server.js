var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());
var options = {
	host: '127.0.0.1',
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.crt')
};
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
app.use('/', express.static('./html', {maxAge: 60*60*1000}));
app.get('/getcity', function(req, res) {
	console.log("In getcity route");
	res.json([{city: "Price"},{city: "Provo"}]);
});
app.get('/comments', function(req, res) {
	console.log("In comment route");
	resarray = [
		{ Name: 'Mickey', Comment: 'Hello',
        _id: '54f53d5ebf89e6100c2180da' },
      { Name: 'Mark', Comment: 'This is a comment',
        _id: '54f53e21801a52330c04be8a' }
	];
	res.json(resarray);
});
app.post('/comments', function(req, res) {
	console.log("In POST comment route");
	console.log(req.body);
	res.status(200);
	res.end();
})