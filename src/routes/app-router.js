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


app.get('/',function(req, res) {

	sess = req.session;
	console.log("route /->" + sess.email);
    console.log("route /->" + sess.login);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(datas.var1 + "<br />" + datas.var2 + " session email:(" + sess.email + ") -  session login:(" + sess.login + ")");    

});



// AUTRES EXEMPLES
app.get('/welcome', (req, res) => {
    var path = require('path');
    sess = req.session;
    console.log("session login de welcome: " + sess.email);
    if(sess.email) {
        return res.redirect('/admin');
    }

    res.sendFile(path.resolve('loginForm.html'));
});



app.post('/auth',(req,res) => {
   
    sess = req.session;
    sess.email = req.body.email;

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end('done');


            
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