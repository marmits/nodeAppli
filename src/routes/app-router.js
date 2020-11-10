const express = require('express');
const app = express.Router();
const moment = require('moment');

var serveur  = "serveur nodejs\n";
var message = "power up: Ok\n";

var datas = {var1:serveur, var2:message, var3:"test3", var4:"test4"};



app.get('/',function(req, res) {

	sess = req.session;
	console.log(sess.email);
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(datas.var1 + "<br />" + datas.var2 + " " + sess.email);    

});

app.get('/welcome', (req, res) => {
	var path = require('path');
    sess = req.session;
    if(sess.email) {
        return res.redirect('/admin');
    }

    res.sendFile(path.resolve('test.html'));
});


app.post('/login',(req,res) => {
    sess = req.session;
    sess.email = req.body.email;
    res.end('done');
});


app.get('/admin',(req,res) => {
    sess = req.session;
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



module.exports = app;