var userConnect = {};
var tabClients = [];
let mainScript = function(){

	this.nodeJSclient = null;
	this.lien = document.getElementById('lien');
	this.resultat = document.querySelectorAll('div.resultat');
	this.gauche = document.querySelectorAll('div.gauche');
	this.main = document.querySelectorAll('div.main');
	this.login =  document.getElementById("login");
	this.client_id =  document.getElementById("client_id");
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

    this.init = function(){
        let that = this;

			that.SetidclientSession(socketid)
			.then((datas) =>  {	

			});
    };    

	this.registerToNodeJsServer = function(id_client) {
		this.nodeJSclient = new nodeJSclient();
		// Connexion au serveur
		this.nodeJSclient.connectServer(id_client);
	};
	
    this.bindLoginSubmit = function(){
    	let that = this;
    	if(that.submit !== undefined){
    		that.submit.addEventListener('click', function(e){
    			e.stopPropagation();
                e.preventDefault(); 
                
                that.SetLoginSession(that.login.value)
                .then((datas) =>  {                	              
                	if(datas.connect === 1){

                		var span = document.createElement("SPAN");
                		var input  = document.createElement("input");
                		that.main[0].appendChild(input).setAttribute("id","client_id");
                		that.main[0].appendChild(input).setAttribute("type","hidden");
                		document.getElementById("client_id").value = datas.client.id;

                		that.main[0].appendChild(span).innerHTML = "";

                		that.main[0].querySelectorAll('span')[0].innerHTML = datas.client.infos.nom;
                		var div = document.createElement("DIV");
						that.resultat[0].appendChild(div).innerHTML=datas.client.id + " " + datas.client.infos.nom + " " + datas.client.infos.role + " connecté"; 
						that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], true);
						that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], false);


						that.registerToNodeJsServer(datas.client.id);

						that.SetStatutClient(datas.client.id, "1")
						.then((update) => {
							
							if( update.updateOnline === "1"){
								that.nodeJSclient.socketio.emit('connecton',  datas);
							
								that.nodeJSclient.socketio.on('connecton', function(client){
									
			
									for (var i = 0; i < client.length; i++) {
										var AlreadyOnlineUser = client[i].nom;
										if(datas.client.id !== client[i].id){	
											var div = document.createElement("DIV");
											that.resultat[0].appendChild(div).innerHTML= AlreadyOnlineUser + " ONLINE";
										} 
									}								
								});

		                		that.bindLien(datas.client);
		                		that.bindDeco(datas.client.id);
							}
						});

						
                		
                	}			        
			    });
                
                return false;                           
    		});
    		
    	}
    };

    this.bindLien = function(client){
        let that = this;

        if(that.lien !== undefined){        
            that.lien.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault(); 
               
                that.nodeJSclient.socketio.emit('clicklien', "ok", client);
                that.nodeJSclient.socketio.on('clicklien', function(msg, client, socketID){
	            	 
	                var div = document.createElement("DIV");
	                that.resultat[0].appendChild(div).innerHTML= socketID + " "  + msg + " id: " +  client.id + "nom: " + client.infos.nom; 
	            });
                return false;
            });
            
        }
    };

    this.SetLoginSession = async function(login){
    	
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
                    resolve(obj);
                }
            };
            xhr.onerror = function(){
                reject("la requête a echoué");
            };
        });
        return res;    
    };

    this.SetStatutClient = async function(clientId, statut){
    	
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

    this.SetidclientSession = async function(socketid){
    	
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

    this.bindDeco = function(clientId){
    	let that = this;
    	if(that.deco !== undefined){
    		that.deco.addEventListener('click', function(e){
    			e.stopPropagation();
                e.preventDefault(); 
                //that.nodeJSclient.socketio.emit('disconnect', clientId);
               //console.log(clientId);
               
                that.nodeJSclient.socketio.emit('coupe',  clientId);
				that.nodeJSclient.socketio.on('coupe', function( socketId){
					console.log(socketId);
					that.SetStatutClient(clientId, "0")
					.then((update) => {
						that.main[0].querySelectorAll('span')[0].innerHTML = "";
	    				that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], true);
	    				that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
	    				var div = document.createElement("DIV");
	    				that.resultat[0].appendChild(div).innerHTML=clientId + " OFFLINE";
					});
				});
                return false;                           
    		});
    		
    		/*that.nodeJSclient.socketio.on('disconnect', function( test){
	    			
	    				
	    				
	    				that.SetStatutClient(clientId, "0")
						.then((update) => {
							that.main[0].querySelectorAll('span')[0].innerHTML = "";
		    				that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], true);
		    				that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
		    				var div = document.createElement("DIV");
		    				that.resultat[0].appendChild(div).innerHTML=clientId + " OFFLINE";
						});
						//that.resultat[0].appendChild(div).innerHTML = qui.datas.nom + " déconnecté";
	    			 		
				});
				*/
    	}
    };
    
	this.bindLoginSubmit();
	

};

mainScript();