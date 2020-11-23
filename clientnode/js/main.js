var userConnect = {};
var tabClients = [];
var mainScript = function(){
    this.nodeJSclient = null;
    this.lien = document.getElementById('lien');
    this.resultat = document.querySelectorAll('div.resultat');
    this.main = document.querySelectorAll('div.main');
    this.gauche = document.querySelectorAll('div.gauche');
    this.login =  document.getElementById("login");
    this.idClientConnected = null;
    this.socketid = null;
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

mainScript.prototype.setElementHTML = function(element,visible){
	let that = this;
	let a = document.createElement("A");      
	that.gauche[0].prepend(a);  
	a.setAttribute("href", "#");
	a.setAttribute("id","lien");
	a.innerHTML = "Client envoi pour nodejs";
};

mainScript.prototype.registerToNodeJsServer = async function() {
    let that = this;
    let res = new Promise(function (resolve, reject) {   
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
            let span = document.createElement("SPAN");
            that.main[0].appendChild(span).innerHTML = "";
            that.main[0].querySelectorAll('span')[0].innerHTML = datas.client.infos.nom;
            

            let input  = document.createElement("input");
            that.main[0].appendChild(input).setAttribute("id","client_id");
            that.main[0].appendChild(input).setAttribute("type","hidden");                      
            document.getElementById("client_id").value =datas.client.infos.id;

            let div = document.createElement("DIV");
            that.resultat[0].appendChild(div).innerHTML=datas.client.infos.id + " " + datas.client.infos.nom + " " + datas.client.infos.role + " connecté"; 
            
            that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], true);
            that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], false);

			
            
        }
    } 
    return false;        
};
    
mainScript.prototype.bindLoginSubmit = function(){
    let that = this;
    let donnees = null;
    let client = null;
    let clientId = null;
    if(submit !== undefined){               
        if(submit !== undefined){ 
            submit.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault(); 
                
                that.SetLoginSession(that.login.value)          
                .then((datasBdd) =>  {
                    donnees = datasBdd;
                    that.idClientConnected = donnees.client.infos.id;                                    
                    return that.registerToNodeJsServer();
                })
                .then((OKserverNodejs) => {  

                    return that.SetStatutClient(donnees.client.infos.id, "1");
                })
                .then((updateStatutClient) => {
                    if( updateStatutClient.updateOnline === "1"){

                    	
                    	that.setElementHTML();
                        that.nodeJSclient.socketio.emit('connecton',  donnees);
                        that.nodeJSclient.socketio.on('connecton', function(User){
                            that.affichage(null,donnees, "on");
                            //ici a chaque fois qu'un client se connecte                            
                            let sortie = User.data.client.infos.id + " " + User.data.client.infos.nom + " " + User.socketIdClient;
                            let div = document.createElement("DIV");
                            that.resultat[0].appendChild(div).innerHTML=sortie + " ONLINE";                               

                        });

                        if(deco !== undefined){
                            deco.addEventListener('click', function(e){
                                e.stopPropagation();
                                e.preventDefault(); 
                                clientId = donnees.client.infos.id;
                                compteur=0;
                                that.resultat[0].innerHTML="";                              
                                that.nodeJSclient.socketio.emit('coupe',  clientId);            
                                                         
                            });
                        }
                        if(lien !== undefined){
                            lien.addEventListener('click', function(e){
                                e.stopPropagation();
                                e.preventDefault(); 
                                client = donnees.client;
                                that.nodeJSclient.socketio.emit('clicklien', "ok", client);
                                return false;
                            });                               
                        }

                        that.nodeJSclient.socketio.on('coupe', function( socketId, clientId, type){                           
                            //chercher en fonction de idClient les infos du client qui se deconnecte pour affichage                                    
                            that.GetInfosClient(clientId)                        
                            .then((infosClientDeco) =>  { 
                                if(document.getElementById("client_id")){      
                                    if(infosClientDeco.results.id === parseInt(document.getElementById("client_id").value)){
                                        // pour gérer l'interface du client concerné
                                        window.location.href = "/nodeAppli/clientnode/"; 
                                    }
                                    else {                                        
                                        // pour les autres, broadcast pour informer de la déconnexion
                                        let div = document.createElement("DIV");
                                        that.resultat[0].appendChild(div).innerHTML=infosClientDeco.results.nom + " est déconnecté (" + type + ")";  
                                    }
                                } 
                            })
                             .catch((raison) => {
			                    console.log(raison);
			                    alert(raison);
			                });  
                        });     
                        that.nodeJSclient.socketio.on('clicklien', function(msg, client, socketID){                  
                            let div = document.createElement("DIV");
                            that.resultat[0].appendChild(div).innerHTML= socketID + " "  + msg + " id: " +  client.infos.id + "nom: " + client.infos.nom; 
                        });                                                 
                    }
                })
                .catch((raison) => {
                    console.log(raison);
                    alert(raison);
                });                                         
            });
        }
    }
    return false;
};

mainScript.prototype.SetLoginSession = async function(login){
    let xhr=new XMLHttpRequest();
    let url = "http://127.0.0.1:1337/sessionuser/" + login;        
    let res = new Promise(function (resolve, reject) {
        xhr.withCredentials = false;
        xhr.open("GET",url);
        xhr.responseType = "json";
        xhr.send();
        xhr.onload = function(){
            if (xhr.status != 200){ 
                console.log("Erreur " + xhr.status + " : " + xhr.statusText);
                reject("entrer un login");
            }else{ 
                let datas = [];
                let status = xhr.status;
                let obj = JSON.parse(JSON.stringify(xhr.response));   
                if(obj.connect === 1){
                    resolve(obj);
                } else {
                    reject(obj.message);
                }
            }
        };
        xhr.onerror = function(){
            reject("connexion sql impossible, lancer nodejs");
        };
    });
    return res;    
};

mainScript.prototype.SetStatutClient = async function(clientId, statut){
    let xhr=new XMLHttpRequest();
    let url = "http://127.0.0.1:1337/updatestatut/" + clientId + "/statut/" + statut;

    let res = new Promise(function (resolve, reject) {
        xhr.withCredentials = false;
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
                if(obj.error === 0){
                	resolve(obj);
                } else {
                	reject(obj.message);
                }
            }
        };
        xhr.onerror = function(){
            reject("set status client sql impossible");
        };
    });
    return res;    
};

mainScript.prototype.SetidclientSession = async function(socketid){
    let xhr=new XMLHttpRequest();
    let url = "http://127.0.0.1:1337/idclientsession/" + socketid;

    let res = new Promise(function (resolve, reject) {
        xhr.withCredentials = false;
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
    let xhr=new XMLHttpRequest();
    let url = "http://127.0.0.1:1337/getinfosclient/" + clientId;

    let res = new Promise(function (resolve, reject) {
        xhr.withCredentials = false;
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
                if(obj.error === 0){                     
                	resolve(obj);
                } else if(obj.error === 1){
                	reject(obj.message);
                }
            }
        };
        xhr.onerror = function(){
            reject("get infos clients sql impossible");
        };
    });
    return res;    
};


var app = new mainScript();
app.init();

