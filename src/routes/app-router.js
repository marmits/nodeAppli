const Logger = require('../Logger');
const express = require('express');
const app = express.Router();
const moment = require('moment');
var fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
var serveur  = "serveur nodejs\n";
var message = "power up: Ok\n";

var datas = {var1:serveur, var2:message, var3:"test3", var4:"test4"};

var tabClientsConnect = [];


var clientData = {};

app.get('/',function(req, res) {

	sess = req.session;
	console.log(sess.login);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(datas.var1 + "<br />" + datas.var2 + " " + sess.email);    

});

app.get('/welcome', (req, res) => {
	var path = require('path');
    sess = req.session;
    if(sess.email) {
        return res.redirect('/admin');
    }

    res.sendFile(path.resolve('loginForm.html'));
});

app.get('/sessionuser/:login',(req,res) => {
    sess = req.session;  
    sess.login = req.params.login;

    let client = {};
    const Users = require('../Users');
    const Client = require('../Client');
    const User = new Users();    
    User.checkUser(sess.login)
    .then((results) => {
        user = results[0];  
        if( results.length !== 0){
            sess.connect = 1;
            user = results[0];     
        }
        return User.setClients(user);
    })
    .then((listClients) => {
        tabClientsConnect.push(listClients);

        clientData.id = listClients.id;
        clientData.infos = {nom:listClients.nom, role:listClients.role};
        
        res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify({connect: sess.connect,  client:clientData}));
        Logger.log("Recup database ", `User pass: ${listClients.pass}`);     
        Logger.log("click submit client de ", `User login: ${clientData.infos.nom}`); 
        User.logActionInDatabase(listClients.id,"connexion")
    });
    
});   

app.get('/getinfosclient/:clientId',(req,res) => {
    const Users = require('../Users');
    const User = new Users();
    User.getUserById(req.params.clientId)
    .then((results) => {
        res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify({results: results}));
    })

});  



app.get('/updatestatut/:userid/statut/:statut',(req,res) => {
    sess = req.session;
    var userid = req.params.userid;
    var statut = req.params.statut;
    var updateOnline = null;
    const Users = require('../Users');
    const User = new Users();    
    User.updateStatut(userid, statut)
    .then((results) => {
        updateOnline = results; 
        if( results === "1"){
            return User.onlineUser();  
        }      
    })
    .then((usersOnline) => {
        
        res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify({usersOnline: usersOnline, updateOnline:updateOnline})); 
    });
    
});    

app.post('/login',(req,res) => {
   
    sess = req.session;

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    const Users = require('../Users');
    const User = new Users();
    var user = null;
    sess.connect = 0;
    User.checkUser(req.body.email)
    .then((results) => {
        user = results[0];

        if( results.length !== 0){
            User.logActionInDatabase(user.id,"connexion");
            
            sess.email = req.body.email;
            sess.connect = 1;


                User.setClients(user, client.id)
                .then((listClients) => {
                    sess.clients = listClients[client.id];
                }); 
          
        } 
        res.end('done');
    });

    
    
});


app.get('/admin',(req,res) => {
    sess = req.session;
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
   
    if(sess.email) {
       
        res.write(`<h1>Hello ${sess.email} </h1><br>`);
        res.write(`<br>`);
        res.write(`<a href=http://devtest:64640/nodeAppli/clientnode>Client</a>`);
        res.write(`<br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/welcome'+'>Login</a>');
    }
});

app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/welcome');
    });

});


app.get('/connect',function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('clientnode/express01.html', function (err,data) {
        res.end(data);
    });
});

app.get('/hello/:name', function(req,res) {
    sess = req.session;
    var test = "ici";
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
    res.end(JSON.stringify({message: 'Hello ' + req.params.name + '!', emailSession:sess.email,  testRep:test}));
});




module.exports = app;