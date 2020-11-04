var http = require('http');
var test  = "coucou";
var hello = "Hello World\n";
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(test + " " + hello);
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

