var userConnect = {};
var tabClients = [];
let mainScript = function(){

	this.nodeJSclient = null;
	this.lien = document.getElementById('lien');
	this.resultat = document.querySelectorAll('div.resultat');
	this.gauche = document.querySelectorAll('div.gauche');
	this.main = document.querySelectorAll('div.main');
	this.login =  document.getElementById("login");
	this.socketid = null;

	this.setElementVisibility = function(element,visible){
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

    

	this.registerToNodeJsServer = function() {
		this.nodeJSclient = new nodeJSclient();
		// Connexion au serveur
		this.nodeJSclient.connectServer();
	};

    this.init = function(){
        let that = this;
        var span = document.createElement("SPAN");
         
        that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], true);
        that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
        that.main[0].appendChild(span).innerHTML = "";
        this.nodeJSclient.socketio.on('setConfig', function(msg, socketid){
			
			// mettre en session le client id

			that.bindSetidclientSession(socketid)
			.then((datas) =>  {
				console.log(datas);
				// mettre en memoire tempo pour etre recupérer par clicklien
				that.socketid = datas.socketid;				
			});
        });
    }

	
    this.bindLoginSubmit = function(){
    	let that = this;
    	if(that.submit !== undefined){
    		that.submit.addEventListener('click', function(e){
    			e.stopPropagation();
                e.preventDefault(); 
                that.main[0].querySelectorAll('span')[0].innerHTML = "";
                that.bindSetLoginSession(that.login.value, that.socketid)
                .then((datas) =>  {
                	
                	console.log(datas);
                	if(datas.connect === 1){
                		that.main[0].querySelectorAll('span')[0].innerHTML = datas.client.socketid + " / " + datas.client.nom;
                		var div = document.createElement("DIV");
						that.resultat[0].appendChild(div).innerHTML=datas.client.socketid + "->" + datas.client.id + " " + datas.client.nom + " " + datas.client.role + " connecté"; 
						that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], true);
						that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], false);
                	}
			        
			    });
                
                return false;                           
    		});
    		
    	}
    };

    this.bindSetLoginSession = async function(login, socketid){
    	
    	var xhr=new XMLHttpRequest();
    	var url = "http://127.0.0.1:1337/sessionuser/" + login + "/socketid/" + socketid;
    	
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
    }

    this.bindSetidclientSession = async function(socketid){
    	
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
    }


    this.bindLien = function(){
        let that = this;
        if(that.lien !== undefined){        
            that.lien.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault(); 
                that.nodeJSclient.socketio.emit('clicklien', "ok");
                return false;
            });
            this.nodeJSclient.socketio.on('clicklien', function(msg,  clients, indice){
               
                var div = document.createElement("DIV");
                that.resultat[0].appendChild(div).innerHTML=clients[indice].idclient + " : " + msg + " / " + clients[indice].nom; 
            });
        }
    };

    this.bindDeco = function(){
    	let that = this;
    	if(that.deco !== undefined){
    		that.deco.addEventListener('click', function(e){
    			e.stopPropagation();
                e.preventDefault(); 
                
                that.nodeJSclient.socketio.emit('logout', userConnect);
                return false;                           
    		});
    		this.nodeJSclient.socketio.on('logout', function(statut, qui){
    			if(statut === 1){

    				that.main[0].querySelectorAll('span')[0].innerHTML = "";
    				that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], true);
    				that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
    				var div = document.createElement("DIV");
					that.resultat[0].appendChild(div).innerHTML = qui.datas.nom + " déconnecté";
    			}    		
			});
    	}
    };

    
	this.registerToNodeJsServer();
    this.init();
	this.bindLien();
	this.bindLoginSubmit();
	this.bindDeco();

};

mainScript();