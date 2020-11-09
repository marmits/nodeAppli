const Logger = require('./src/Logger');
var express = require('express');
var fs = require('fs');
var app = express();
var cookieParser = require('cookie-parser')();
var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({store: new SessionStore({path: __dirname+'/tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});


app.use(session);

const http = require('http').Server(app);
const io = require('socket.io').listen(http);


io.use(function(io, next) {
  var req = io.handshake;
  var res = {};
  cookieParser(req, res, function(err) {
     if (err) return next(err);
     session(req, res, next);
  });
});


session.idclient = null;

var serveur  = "serveur nodejs\n";
var message = "power up: Ok\n";

var datas = {var1:serveur, var2:message, var3:"test3", var4:"test4"};

app.get('/',function(req, res) {
    req.session.idclient = "rien";
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
   	res.end(datas.var1 + "<br />" + datas.var2 + " " + req.session.idclient);    
});


app.get('/welcome', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end("route welcome" + "<br />" + datas.var3 + " " + datas.var4); 
});


// On lance l'écoute du serveur NodeJS sur le port 8001
let server = http.listen(1337, () => {
    let host = server.address().address;
    let port = server.address().port;
    Logger.log("http.server(express)", `Le serveur NodeJS est démarré et écoute sur le port ${port}`);
});

const Users = require('./src/Users');
const User = new Users();
const clients = {};

io.on('connection', client => {


  client.on('setConfig', data => { 
    //io.handshake.session.idclient = client.id;
    console.log(client.id);
  	Logger.log("Environnement ", `${data}`);	
    //console.log("Session client: ", io.handshake.session.idclient);
    io.emit('setConfig', data);

  });



  client.on('submitNom', nom => {    
    User.checkUser(nom)
    .then((results) => {
      var user = null;
      if( results.length !== 0){
        
        session.idclient = client.id;
        user = results[0];           
        User.logActionInDatabase(user.id,"connexion");
        //clients.clientid = user.idclient;

        console.log("Session client: ", client.id);
          
        Logger.log("Recup database ", `User pass: ${user.pass}`);     
        Logger.log("click submit client de ", `User: ${nom} from ${client.id}`); 
      }      
      io.emit('submitNom', user, session.idclient);

    });    
    
  });





  client.on('logout', user => { 
    //io.emit("logout", user);
    console.log(user);
    io.emit('logout', 1, user);
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
      Logger.log("Deconnection de:  ", `from ${session.idclient}`); 
  });


  client.on('clicklien', data => { 
    console.log(clients); 
    io.emit('clicklien', data, session.idclient);
    Logger.log("click lien de ", `message: ${data} from ${session.idclient}`);  
    console.log("Session client: ", session.idclient);

  });

});