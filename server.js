var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth-connect');
var app = express();
app.use(bodyParser());
var auth = basicAuth(function(user, pass) {
    return((user ==='cs360')&&(pass === 'test'));
});
var options = {
	host: '127.0.0.1',
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.crt')
};
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
app.use('/', express.static('./html', {maxAge: 60*60*1000}));
// GET getcity/
app.get('/getcity', function(req, res) {
	var url_obj = url.parse(req.url, true, false);
	var search = url_obj.query['q'];
	if (search === "") return;
	var found = [];
	fs.readFile("UTCityList.txt", function(err, data) {
		if (err) throw err;
		cities = data.toString().split("\n");
		found = [];
		cities.forEach(function (city_name, index) {
			//console.log(city_name);
			var search_length = search.length;
			var city_pre = city_name.substring(0, search_length);
			//console.log(city_pre);
			if (city_pre == search) {
				//console.log(city_name);
				var city_obj = { city:city_name }
				found.push(city_obj);
			}
		});
		//console.log(found);
		res.writeHead(200);
		res.end(JSON.stringify(found));
	});
});
// GET comments/
app.get('/comments', function(req, res) {
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/weather", function(err, db) {
		if(err) throw err;
		db.collection("comments", function(err, comments){
			if(err) throw err;
			comments.find(function(err, items){
				items.toArray(function(err, itemArr){
					// console.log("Document Array: ");
					// console.log(itemArr);
					res.writeHead(200);
					res.end(JSON.stringify(itemArr));
				});
			});
		});
	});
});
// POST comments/
app.post('/comments', auth, function(req, res) {
	//console.log("In POST comments route");
	var reqObj = req.body;
	//console.log(reqObj);
	//console.log("Name: " + reqObj.Name);
	//console.log("Comment: " + reqObj.Comment);
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/weather", function(err, db) {
		if(err) throw err;
		db.collection('comments').insert(reqObj,function(err, records) {
			if (records) {
				//console.log("Record added as " + records[0]._id);
			}
		});
	});
	res.writeHead(200);
	res.end();
});









