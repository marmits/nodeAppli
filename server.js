const Logger = require('./src/Logger');
var express = require('express');
var fs = require('fs');
var app = express();
const cors = require('cors');



const bodyParser = require('body-parser');

//var sharedsession = require("express-socket.io-session");
const environment = require('./src/config/environment');
const configuration = require(`./config/${environment.jsonConfigFile}`);
const portServerNodejs = configuration.address.portnodejs;
const tmpDirectory = configuration.session.rep;
const fileStoreOptions = {path:tmpDirectory};


const {SessionsAppli} = require('./src/Sessions');
app.use(SessionsAppli.sessions);
/*
var sess; // global session, NOT recommended
*/

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

const http = require('http').Server(app);
const io = require('socket.io').listen(http);



//io.use(sharedsession(session));

const clients = [];
let compteur = 0;
module.exports.clients = clients;

var corsOptions = {
    origin: '*',
    credentials: true 
};

//app.use(cors(corsOptions));

//delete require.cache[require.resolve("./src/routes/app-router")];
app.use(cors());


app.use(express.static(__dirname + '/clientnode'));
app.use(express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use(require('./src/routes/app-ajax'));
app.use(require('./src/routes/app-router'));


// On lance l'écoute du serveur NodeJS sur le port voir dans config environment
let server = http.listen(portServerNodejs, () => {
  const {getClientById, deconnectClient:decoC, rmTmpDir} = require('./src/utils/utils');

  rmTmpDir(fileStoreOptions.path, false)// on vide le repertoire des sessions
  .then(() => {
    User.resetConnection(); // on remet le statut online à 0 pour tout le monde au lancemant de l'appli
  })
  .then((results) => { 
    let host = server.address().address;
    let port = server.address().port;
    Logger.log("http.server(express)", `Le serveur NodeJS est démarré et écoute sur le port ${port}`);
    io.on('connection', (socket) => {

      let client = new Client();
      client.socket = socket;
      let typeCoupure = "auto";

      Logger.log(`Nouvelle connexion`,`Socket ${client.socket.id} connecté.`,client.socket);

      socket.on('setConfig', (data, _client_id) => { 
        Logger.log("Environnement ", `${data}`);  
        client.clientId = _client_id;
        let connectedClient = getClientById(client.clientId);

        if(connectedClient === undefined) {

          Logger.log("Association socket <> client",`Socket ${client.socket.id} associé  au client id:  ${client.clientId}`, client.socket);    

          
          clients.push(client);
          compteur++;

        } else {
          Logger.log("Réassociation socket <> client",`Socket ${client.socket.id} associé au client id:  ${client.clientId}`, client.socket);
          connectedClient.socket = socket;
        }       
      });


      socket.on('connecton', (data) => {     
        let userOnline = null;
        let socketIdClient = client.socket.id;
        userOnline = {socketIdClient, data};
          io.emit('connecton', userOnline);
      });


      socket.on('clicklien', (data, client) => { 
        Logger.log("click lien de ", `message: ${data} from ${socket.id} userId ${client.infos.id} `); 
        io.emit('clicklien', data, client, socket.id);
      });


      socket.on('coupe', () => {      
        if(client.clientId !== null) {     
            typeCoupure = "bouton déco";            
            decoC(User, io, client, typeCoupure);            
        }     
      });

      // Le client a coupé le socket (changement de page, refresh, fermeture brutale etc ...)
      socket.on('disconnect', () => {
        if(typeCoupure === "auto"){
          if(client.clientId !== null) {              
            decoC(User, io, client, typeCoupure);                          
          }
        }
      });

    });
  }).catch((raison) => {
      console.log(raison);
  });  


  const Client = require('./src/Client');
  const Users = require('./src/Users');
  const User = new Users();



  User.resetConnection() // on remet le statut online à 0 pour tout le monde au lancemant de l'appli
   
});




