const Logger = require('./src/Logger');
var express = require('express');
var fs = require('fs');
var app = express();
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
var sharedsession = require("express-socket.io-session");


app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

const http = require('http').Server(app);
const io = require('socket.io').listen(http);

var sess; // global session, NOT recommended

//io.use(sharedsession(session));

const clients = [];
module.exports.clients = clients;


app.use(cors());
app.use(require('./src/routes/app-router'));

const {getClientById} = require('./src/utils/utils');


// On lance l'écoute du serveur NodeJS sur le port 8001
let server = http.listen(1337, () => {
    let host = server.address().address;
    let port = server.address().port;
    Logger.log("http.server(express)", `Le serveur NodeJS est démarré et écoute sur le port ${port}`);
});

const Users = require('./src/Users');
const User = new Users();
const Client = require('./src/Client');

io.on('connection', (socket) => {

  let client = new Client();
  client.socket = socket;

   Logger.log(`Nouvelle connexion`,`Socket ${client.socket.id} connecté.`,client.socket);

  socket.on('setConfig', (data, _client_id) => { 
    Logger.log("Environnement ", `${data}`);  
    client.clientId = _client_id;
    let connectedClient = getClientById(client.clientId);

    if(connectedClient === undefined) {

      Logger.log("Association socket <> client",`Socket ${client.socket.id} associé  au client id:  ${client.clientId}`, client.socket);          
      clients.push(client);

    } else {
      Logger.log("Réassociation socket <> client",`Socket ${client.socket.id} associé au client id:  ${client.clientId}`, client.socket);
      connectedClient.socket = socket;
    }      	

  });




  socket.on('clicklien', (data, client) => { 
    
    Logger.log("click lien de ", `message: ${data} from ${socket.id} userId ${client.id} `); 
    io.emit('clicklien', data, client, socket.id);

  });

  socket.on('connecton', (data) => { 
   
    User.onlineUser()
    .then((usersOnline) => {

      io.emit('connecton', usersOnline);
    });
    

  });

  // Le client a coupé le socket (changement de page, refresh, fermeture brutale etc ...)
  socket.on('coupe', (idClient) => {

      
      if(client.clientId !== null) {
             
          console.log(idClient);
          io.emit('coupe',  client.socket.id);
          Logger.log("Déconnexion socket",`Socket ${client.socket.id} ( client id : ${client.clientId}) déconnecté.`, client.socket);

      
        client.socket.disconnect(true);
        delete client.socket;
      }
     
  });

  // Le client a coupé le socket (changement de page, refresh, fermeture brutale etc ...)
  /*socket.on('disconnect', (data) => {

   
      io.emit('disconnect',  client.clientId);
      if(client.clientId !== null) {
             
          Logger.log("Déconnexion socket",`Socket ${client.socket.id} ( client id : ${client.clientId}) déconnecté.`, client.socket);

      
        client.socket.disconnect(true);
        delete client.socket;
      }
  });
  */

});