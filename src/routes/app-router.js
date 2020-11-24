const Logger = require('../Logger');
const express = require('express');
const app = express.Router();
const moment = require('moment');
var fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io').listen(http);
const environment = require('../config/environment');
const configuration = require(`../../config/${environment.jsonConfigFile}`);
var serveur  = "serveur nodejs\n";
var message = "power up: Ok\n";

var datas = {var1:serveur, var2:message, var3:"test3", var4:"test4"};




app.get('/',function(req, res) {

    sess = req.session;
    console.log("route /->" + sess.email);
    console.log("route /->" + sess.login);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    let serverUrl = configuration.address.nodejs + ":" + configuration.address.portnodejs + "/accueil.html";
    let adresseClient = `<a href="${serverUrl}">Client node</a>`;
    res.end(datas.var1 + "<br />" + datas.var2 + " session email:(" + sess.email + ") -  session login:(" + sess.login + ")<br>" + adresseClient);    

});



app.get('/accueil.html', function(req, res) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('clientnode/accueil.html', function (err,data) {
        res.end(data);
    });
 
});



// CREATE ACCOUNT
app.get('/newAccount', (req, res) => {
    var path = require('path');
    sess = req.session;

    console.log("session login de newAccount: " + sess.login);
    if(sess.email) {
        //return res.redirect('/admin');
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendFile(path.resolve('createCount.html'));
});

app.post('/validAccount',(req,res) => {
    const Users = require('../Users');
    const User = new Users();   
    sess = req.session;
    sess.email = req.body.email;
    sess.pass = req.body.pass;

    User.existUser(sess.email)    
    .then((results) => {
        return User.insertNewUser(sess.email, sess.pass);
    })
    .then((results) => {
        
        res.header('Access-Control-Allow-Credentials', 'true');
        res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify({valid:1,  message:results}));
        console.log(results);
    })
    .catch((raison) => {
        res.header('Access-Control-Allow-Credentials', 'true');
        res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify({valid:0,message:raison}));
      console.log(raison);
    }); 
});
app.get('/presentation',(req,res) => {
    sess = req.session;
    res.header('Access-Control-Allow-Credentials', 'true');
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    
    if(sess.email) {
       
        res.write(`<h1>Hello ${sess.email} </h1><br>`);
        res.write(`<a href=${configuration.address.apache}/nodeAppli/>Accès à l'écran de connexion</a>`);
        res.write(`<br>`);
        res.end('');
    }
    else {
        res.write('<h1>Please create account.</h1>');
        res.end('<a href='+'/newAccount'+'>Login</a>');
    }
});


// indépendant de l'application pour tests
// AUTRES EXEMPLES
app.get('/welcome', (req, res) => {
    var path = require('path');
    sess = req.session;
    console.log("session login de welcome: " + sess.email);
    if(sess.email) {
        return res.redirect('/admin');
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendFile(path.resolve('loginForm.html'));
});



app.post('/auth',(req,res) => {
   
    sess = req.session;
    sess.email = req.body.email;
    res.header('Access-Control-Allow-Credentials', 'true');
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end('done');


            
});

app.get('/admin',(req,res) => {
    sess = req.session;
    res.header('Access-Control-Allow-Credentials', 'true');
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
   
    if(sess.email) {
       
        res.write(`<h1>Hello ${sess.email} </h1><br>`);
        res.write(`<br>`);
        res.write(`<a href=${configuration.address.apache}/nodeAppli/clientnode>Client</a>`);
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
        res.header('Access-Control-Allow-Credentials', 'true');
        res.redirect('/welcome');
    });

});


app.get('/connect',function(req, res) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('clientnode/express01.html', function (err,data) {
        res.end(data);
    });
});

app.get('/hello/:name', function(req,res) {
    sess = req.session;
    var test = "ici";
    res.header('Access-Control-Allow-Credentials', 'true');
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
    res.end(JSON.stringify({message: 'Hello ' + req.params.name + '!', emailSession:sess.email,  testRep:test}));
});




module.exports = app;