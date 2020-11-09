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

const Users = require('./src/Users');
const User = new Users();
const clients = [];

io.on('connection', client => {

  Logger.log("Client connecté ", `ID: ${client.id} ${client.id}`);

  client.on('setConfig', data => { 
  	Logger.log("Environnement ", `${data}`);	

  });
  client.on('clicklien', data => { 
    console.log(clients); 
  	io.emit('clicklien', data);
  	Logger.log("click lien de ", `message: ${data} from ${client.id}`);	

  });
  client.on('submitNom', nom => {    
    User.checkUser(nom)
    .then((results) => {
      var user = null;
      if( results.length !== 0){
        results[0].id_client = client.id;
        
        user = results[0];           
        User.logActionInDatabase(user.id,"connexion");
        clients.push(user);
          
        Logger.log("Recup database ", `User pass: ${user.pass}`);     
      }      
      io.emit('submitNom', user);

    });    
    Logger.log("click submit client de ", `User: ${nom} from ${client.id}`); 
  });

  client.on('logout', id => { 

    io.emit("logout", 1);
    var i = 0;
    clients.forEach((cli) => {      

      if (cli.id_client === client.id) {
        clients.splice(i, 1);
        if(client.id !== id){
          client.emit('disconnect');
        }
      }
    i++;
    });
   
    

  });
  client.on('disconnect', () => {     
      Logger.log("Deconnection de:  ", `from ${client.id}`); 
  });
});