var express = require('express');
var app = express();
app.use('/', express.static('./html', {maxAge: 60*60*1000}));
app.listen(80);
