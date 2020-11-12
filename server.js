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

  let clientConnect = new Client();
  clientConnect.socket = socket;


  socket.on('setConfig', data => { 
    clientConnect.idclient = socket.id;
    let connectedClient = getClientById(clientConnect.idclient);


    if(connectedClient === undefined) {

            Logger.log("Association socket <> client",`Socket ${socket.id} associé  au client ${clientConnect.idclient}`, clientConnect.socket);          
            clients.push(clientConnect);
        } else {
            Logger.log("Réassociation socket <> client",`Socket ${clientConnect.socket.id} associé au client  ${clientConnect.idclient}`, clientConnect.socket);
            connectedClient.socket = socket;
        }

  	Logger.log("Environnement ", `${data}`);	
    io.emit('setConfig', data, socket.id);
  });




  socket.on('clicklien', data => { 
    console.log(clientConnect.idclient);
    
    Logger.log("click lien de ", `message: ${data} from ${socket.id}`); 
    
    const found = clients.find(element => element.idclient === socket.id);   
    
     
    if(found !== undefined){
      indice = clients.indexOf(found);
      console.log(clients[indice]);
      //io.emit('clicklien', data,  clients, indice);
    }
    
    
    
  });




  socket.on('logout', user => { 
    
    console.log(user.datas.nom);
    io.emit('logout', 1, user);

    const found = tabClientsConnect.find(element => element.idclient === user.id);
    socket.emit('disconnect');
    var i = 0;
    /*clients.forEach((cli) => {      

      if (cli.id_client === user.idclient) {
        //clients.splice(i, 1);
        
        
        
      }
    i++;
    });
    */
  });

  socket.on('disconnect', () => {     
      Logger.log("Deconnection de:  ", `from ${socket.id}`); 
  });

});