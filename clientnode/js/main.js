var userConnect = {};
var tabClients = [];
var mainScript = function(){
    this.nodeJSclient = null;
    this.lien = document.getElementById('lien');
    this.resultat = document.querySelectorAll('div.resultat');
    this.gauche = document.querySelectorAll('div.gauche');
    this.main = document.querySelectorAll('div.main');
    this.login =  document.getElementById("login");
    this.idClientConnected = null;
    this.socketid = null;
};

mainScript.prototype.setElementVisibility = function(element,visible){
        if(typeof visible === "boolean" && element instanceof HTMLElement){
            if(visible === true){
                if (element.classList.contains("hidden")){
                    element.classList.remove("hidden");
                }
            }else{
                if (!element.classList.contains("hidden")){
                    element.classList.add("hidden");
                }
            }
        }
};

mainScript.prototype.init = function(){
    let that = this;
    that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
    that.bindLoginSubmit();
    /*that.registerToNodeJsServer()
	.then((okConnectSocketIO) => { 
	});			
	*/			    
};    

mainScript.prototype.registerToNodeJsServer = function() {
        let that = this;
        var res = new Promise(function (resolve, reject) {
            
            that.nodeJSclient = new nodeJSclient();
            // Connexion au serveur
            resolve(that.nodeJSclient.connectServer(that.idClientConnected));                
            reject("connection nodejs serveur impossible");          

        });

        return res;
};

mainScript.prototype.affichage = function(idClient=null, datas={}, statut="off"){
        
    let that = this;
    if(statut === "on"){
        if(that.main[0].querySelectorAll('span')[0]) {
        
        } else {
            var span = document.createElement("SPAN");
            that.main[0].appendChild(span).innerHTML = "";
            that.main[0].querySelectorAll('span')[0].innerHTML = datas.client.infos.nom;
            

            var input  = document.createElement("input");
            that.main[0].appendChild(input).setAttribute("id","client_id");
            that.main[0].appendChild(input).setAttribute("type","text");                      
            document.getElementById("client_id").value =datas.client.id;

            var div = document.createElement("DIV");
            that.resultat[0].appendChild(div).innerHTML=datas.client.id + " " + datas.client.infos.nom + " " + datas.client.infos.role + " connecté"; 
            
            that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], true);
            that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], false);
            
        }
    } else {
         
        //chercher en fonction de idClient les infos du client qui se deconnecte pour affichage     
        that.GetInfosClient(idClient)
        .then((infosClientDeco) =>  {      
            let nomClientDeco = infosClientDeco.results.nom;
            var div = document.createElement("DIV");
            that.resultat[0].appendChild(div).innerHTML=nomClientDeco + " est déconnecté";  
            // pour gérer l'interface du client concerné
            if(document.getElementById("client_id")){
                if(idClient === parseInt(document.getElementById("client_id").value)){
                    that.main[0].querySelectorAll('span')[0].remove();
                    document.getElementById("client_id").remove();
                    that.resultat[0].innerHTML="";
                    that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
                    that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], true);
                    window.location.href = "/nodeAppli/clientnode/";
                }
            }
        });
    }       
};
    
mainScript.prototype.bindLoginSubmit = function(){
    let that = this;
    let donnees = null;
    var error = 0;
    if(submit !== undefined){               
        if(submit !== undefined){ 
            submit.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault(); 
                that.SetLoginSession(that.login.value)
                .catch(() => {
			        console.log('deja connecté');
			        error = 1;
			    })
                .then((datasBdd) =>  {   
                    
                    if(error === 1){
                    	alert("deja connecté");                    	
                    } else {
	                    donnees = datasBdd;
	                    that.idClientConnected = donnees.client.id;                    
	                    that.registerToNodeJsServer();
	                    return  that.SetStatutClient(donnees.client.id, "1");
                	}
                })
                .then((updateStatutClient) => {    
                	if(error === 0){
	                    if( updateStatutClient.updateOnline === "1"){          
							      
							that.nodeJSclient.socketio.emit('connecton',  donnees);

							that.nodeJSclient.socketio.on('connecton', function(User){

							    that.affichage(null,donnees, "on");
							    //ici a chaque fois qu'un client se connecte                            
							    var sortie = User.data.client.id + " " + User.data.client.infos.nom + " " + User.socketIdClient;
							    var div = document.createElement("DIV");
							    that.resultat[0].appendChild(div).innerHTML=sortie + " ONLINE";						   

							});
							if(deco !== undefined){
							    deco.addEventListener('click', function(e){
							        e.stopPropagation();
							        e.preventDefault(); 
							        var clientId = donnees.client.id
							        compteur=0;
							        that.resultat[0].innerHTML="";
							        that.nodeJSclient.socketio.emit('coupe',  clientId);            
							        return false;                           
							    });
							    that.nodeJSclient.socketio.on('coupe', function( socketId, clientId){

							        that.SetStatutClient(clientId, "0")
							        .then((update) => {
							            that.affichage(clientId, {}, "off");
							        });

							    }); 
							}
							if(lien !== undefined){
							    lien.addEventListener('click', function(e){
							        e.stopPropagation();
							        e.preventDefault(); 
							        var client = donnees.client;
							        that.nodeJSclient.socketio.emit('clicklien', "ok", client);
							        return false;
							    });       
							    that.nodeJSclient.socketio.on('clicklien', function(msg, client, socketID){                  
							        var div = document.createElement("DIV");
							        that.resultat[0].appendChild(div).innerHTML= socketID + " "  + msg + " id: " +  client.id + "nom: " + client.infos.nom; 
							    });     
							}								                    
	                    }
	                }
                });
                return false;                           
            });
        }
    }
};

mainScript.prototype.SetLoginSession = async function(login){
        
        var xhr=new XMLHttpRequest();
        var url = "http://127.0.0.1:1337/sessionuser/" + login;        
        var res = new Promise(function (resolve, reject) {
            xhr.open("GET",url);
            xhr.responseType = "json";
            xhr.send();
            xhr.onload = function(){
                if (xhr.status != 200){ 
                    console.log("Erreur " + xhr.status + " : " + xhr.statusText);
                }else{ 
                    let datas = [];
                    let status = xhr.status;
                    let obj = JSON.parse(JSON.stringify(xhr.response));   
                    if(obj.connect === 1){
                   		resolve(obj);
                   	} else {
                   		reject("deja connecté");
                   	}
                }
            };
            xhr.onerror = function(){
                reject("la requête a echoué");
            };
        });
        return res;    
};

mainScript.prototype.SetStatutClient = async function(clientId, statut){
        
        var xhr=new XMLHttpRequest();
        var url = "http://127.0.0.1:1337/updatestatut/" + clientId + "/statut/" + statut;

        var res = new Promise(function (resolve, reject) {
            xhr.open("GET",url);
            xhr.responseType = "json";
            xhr.send();
            xhr.onload = function(){
                if (xhr.status != 200){ 
                    console.log("Erreur " + xhr.status + " : " + xhr.statusText);
                }else{ 
                    let datas = [];
                    let status = xhr.status;
                    let obj = JSON.parse(JSON.stringify(xhr.response));    

                    resolve(obj);
                }
            };
            xhr.onerror = function(){
                reject("la requête a echoué");
            };
        });
        return res;    
};

mainScript.prototype.SetidclientSession = async function(socketid){
        
        var xhr=new XMLHttpRequest();
        var url = "http://127.0.0.1:1337/idclientsession/" + socketid;

        var res = new Promise(function (resolve, reject) {
            xhr.open("GET",url);
            xhr.responseType = "json";
            xhr.send();
            xhr.onload = function(){
                if (xhr.status != 200){ 
                    console.log("Erreur " + xhr.status + " : " + xhr.statusText);
                }else{ 
                    let datas = [];
                    let status = xhr.status;
                    let obj = JSON.parse(JSON.stringify(xhr.response));    

                    resolve(obj);
                }
            };
            xhr.onerror = function(){
                reject("la requête a echoué");
            };
        });
        return res;    
};

mainScript.prototype.GetInfosClient = async function(clientId){
        
        var xhr=new XMLHttpRequest();
        var url = "http://127.0.0.1:1337/getinfosclient/" + clientId;

        var res = new Promise(function (resolve, reject) {
            xhr.open("GET",url);
            xhr.responseType = "json";
            xhr.send();
            xhr.onload = function(){
                if (xhr.status != 200){ 
                    console.log("Erreur " + xhr.status + " : " + xhr.statusText);
                }else{ 
                    let datas = [];
                    let status = xhr.status;
                    let obj = JSON.parse(JSON.stringify(xhr.response));                        
                    resolve(obj);
                }
            };
            xhr.onerror = function(){
                reject("la requête a echoué");
            };
        });
        return res;    
};


var app = new mainScript();

app.init();

