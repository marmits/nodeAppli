const Logger = require('./src/Logger');
var express = require('express');
var fs = require('fs');
var app = express();

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



var tabClientsConnect = [];

app.use(require('./src/routes/app-router'));




// On lance l'écoute du serveur NodeJS sur le port 8001
let server = http.listen(1337, () => {
    let host = server.address().address;
    let port = server.address().port;
    Logger.log("http.server(express)", `Le serveur NodeJS est démarré et écoute sur le port ${port}`);
});

const Users = require('./src/Users');
const User = new Users();
let clients = {};

io.on('connection', client => {

  client.on('setConfig', data => { 
    var tabClientsConnect = [];
    console.log(tabClientsConnect);
    //io.handshake.session.idclient = client.id; 
  	Logger.log("Environnement ", `${data}`);	
    io.emit('setConfig', data);
  });



  client.on('submitNom', login => {    
    User.checkUser(login)
    .then((results) => {
      var user = null;
      if( results.length !== 0){
        user = results[0];           
        User.logActionInDatabase(user.id,"connexion");
        User.setClients(user, client.id)
        .then((listClients) => {

          clients = listClients[client.id];
          tabClientsConnect.push(clients);

          const found = tabClientsConnect.find(element => element.nom === user.nom);
         
         
          
             indice = tabClientsConnect.indexOf(found);
          
          
          
          io.emit('submitNom', listClients[client.id], client.id, tabClientsConnect, indice);
          


          Logger.log("Recup database ", `User pass: ${user.pass}`);     
          Logger.log("click submit client de ", `User login: ${login} from id:  ${clients.id}`); 
        });  
      }      
    });        
  });

  client.on('clicklien', data => { 
    Logger.log("click lien de ", `message: ${data} from ${client.id}`); 
    
    const found = tabClientsConnect.find(element => element.idclient === client.id);
    
    if(found !== undefined){
      indice = tabClientsConnect.indexOf(found);
      io.emit('clicklien', data,  tabClientsConnect, indice);
    }
    

  });




  client.on('logout', user => { 
    //io.emit("logout", user);
    console.log(user.datas.nom);
    io.emit('logout', 1, user);

    const found = tabClientsConnect.find(element => element.idclient === user.id);
    client.emit('disconnect');
    var i = 0;
    /*clients.forEach((cli) => {      

      if (cli.id_client === user.idclient) {
        //clients.splice(i, 1);
        
        
        
      }
    i++;
    });
    */
  });




  client.on('disconnect', () => {     
      Logger.log("Deconnection de:  ", `from ${client.id}`); 
  });


  

});