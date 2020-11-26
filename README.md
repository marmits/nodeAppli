# nodeAppli (full nodejs: client nodejs)
use socket.io client/server  
[https://github.com/socketio/socket.io](https://github.com/socketio/socket.io)

Test nodejs socketio

# instructions

rename nodeAppli/src/config/environment_.js => nodeAppli/src/config/environment.js  

npm install (package.json)  
npm start  

grunt watch -> sass (Gruntfile.js)


set server:
by default serveur address:
127.0.0.1:1337

-> config/src/environment.js
config/configuration_work.json

-> clientnode/js/main.js

-> via apache access (redirection)  
index.html

to start app :  
via apache => http://serveur.local/nodeAppli/  
direct nodejs => http://127.0.0.1:1337/connexion  




set client to access serveur nodes adress in 
clientnode/js/main.js -> serveurAdress 

[socket.io & socket.io-client documentation](https://github.com/socketio/socket.io-website/tree/master/source/docs)  
[socket.io install](https://github.com/socketio/socket.io-website/blob/master/source/docs/server-installation.md)  
[socket.io-client install](https://github.com/socketio/socket.io-website/blob/master/source/docs/client-installation.md)  