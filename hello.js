
const Logger = require('./src/Logger');
var express = require('express');
var fs = require('fs');
var app = express();

const http = require('http').Server(app);
const io = require('socket.io').listen(http);

var test  = "coucou 5";
var hello = "Hello World\n";

var datas = {var1:test, var2:hello, var3:"test3", var4:"test4"};

app.get('/',function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
   	res.end(datas.var1 + " " + datas.var2);

});

io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});
// On lance l'écoute du serveur NodeJS sur le port 8001
let server = http.listen(1337, () => {
    let host = server.address().address;
    let port = server.address().port;
    Logger.log("Serveur démarré", `Le serveur NodeJS est démarré et écoute sur le port ${port}`);
});




