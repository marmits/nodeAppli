var http = require('http');

var express = require('express');
var fs = require('fs');
var app = express();

var test  = "coucou 5";
var hello = "Hello World\n";

app.get('/',function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
   	res.end(test + " " + hello);
});


app.listen(1337);


console.log('Server running at http://127.0.0.1:1337/');