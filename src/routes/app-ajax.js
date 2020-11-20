const Logger = require('../Logger');
const express = require('express');
const app = express.Router();
const moment = require('moment');
var fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
var serveur  = "serveur nodejs\n";
var message = "power up: Ok\n";

var clientData = {};

app.get('/sessionuser/:login',(req,res) => {
    sess = req.session;  
    sess.login = req.params.login;
    console.log("route ajax sessionuser->" + sess.email);
    var user = {};
    const Users = require('../Users');
    const Client = require('../Client');
    const User = new Users();    
    var error = 0;
    User.checkUser(sess.login)    
    .then((results) => {

        if(results){            

            if( results.length !== 0){
                sess.connect = 1;
                user = results[0];     
            }
        }

        return User.setClients(user);
    })
    .catch((err) => {
        console.error('Err ' + err);
        error = 1;
    })
    .then((listClients) => {
        if(error === 0){
            clientData.id = listClients.id;
            clientData.infos = {nom:listClients.nom, role:listClients.role};
            
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            res.end(JSON.stringify({connect: sess.connect,  client:clientData}));
            Logger.log("Recup database ", `User pass: ${listClients.pass}`);     
            Logger.log("click submit client de ", `User login: ${clientData.infos.nom}`); 
            User.logActionInDatabase(listClients.id,"connexion");
        } else {
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            res.end(JSON.stringify({connect: 0,  client:{}}));
        }
        
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




module.exports = app;