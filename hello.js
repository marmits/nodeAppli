const Logger = require('./src/Logger');
var express = require('express');
var fs = require('fs');
var app = express();

const http = require('http').Server(app);
const io = require('socket.io').listen(http);

var serveur  = "serveur nodejs\n";
var message = "power up: Ok\n";

var datas = {var1:serveur, var2:message, var3:"test3", var4:"test4"};

app.get('/',function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
   	res.end(datas.var1 + "<br />" + datas.var2);
});

// On lance l'écoute du serveur NodeJS sur le port 8001
let server = http.listen(1337, () => {
    let host = server.address().address;
    let port = server.address().port;
    Logger.log("http.server(express)", `Le serveur NodeJS est démarré et écoute sur le port ${port}`);
});


io.on('connection', client => {

  Logger.log("Client connecté ", `ID: ${client.id} ${client.id}`);

  client.on('setConfig', data => { 
  	Logger.log("action page client ", `message: ${data}`);	
  });
  client.on('clicklien', data => { 
  	io.emit('clicklien', data);
  	Logger.log("click lien de ", `message: ${data} from ${client.id}`);	
  });

  client.on('disconnect', () => { 
      Logger.log("Deconnection de:  ", `from ${client.id}`); 
  });
});