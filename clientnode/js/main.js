var userConnect = null;

let mainScript = function(){

	this.nodeJSclient = null;
	this.lien = document.getElementById('lien');
	this.resultat = document.querySelectorAll('div.resultat');
	this.gauche = document.querySelectorAll('div.gauche');
	this.main = document.querySelectorAll('div.main');
	this.nom =  document.getElementById("nom");

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
        that.main[0].appendChild(span).innerHTML="test"; 
        that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], true);
        that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
        this.nodeJSclient.socketio.on('setConfig', function(msg){
             that.main[0].appendChild(span).innerHTML = msg;
        });
    }

	
    this.bindNomSubmit = function(){
    	let that = this;
    	if(that.submit !== undefined){
    		that.submit.addEventListener('click', function(e){
    			e.stopPropagation();
                e.preventDefault(); 
                that.nodeJSclient.socketio.emit('submitNom', that.nom.value);
                return false;                           
    		});
    		this.nodeJSclient.socketio.on('submitNom', function(user, id_clientnodes){
                
                
    			if(user !== null){

                    userConnect = user;
                    console.log(userConnect);
                    that.main[0].querySelectorAll('span')[0].innerHTML = id_clientnodes + " " + userConnect.nom;
                    /*
    				var div = document.createElement("DIV");
					that.resultat[0].appendChild(div).innerHTML=user.id_client;
                    */
					var div = document.createElement("DIV");
					that.resultat[0].appendChild(div).innerHTML=userConnect.id + " " + userConnect.nom + " " + userConnect.role + " connecté"; 
					that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], true);
					that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], false);
                    

				} else {
					console.log("non trouvé");
				}
                
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
    				that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], true);
    				that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
    				var div = document.createElement("DIV");
					that.resultat[0].appendChild(div).innerHTML = qui.nom + " déconnecté";
    			}
    			
			});
    	}
    };


    this.bindLien = function(){
        let that = this;
        if(that.lien !== undefined){        
            that.lien.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault(); 
                that.nodeJSclient.socketio.emit('clicklien', "ok");
                return false;
            });
            this.nodeJSclient.socketio.on('clicklien', function(msg, idclient){
                console.log(idclient);
                var div = document.createElement("DIV");
                that.resultat[0].appendChild(div).innerHTML=idclient + " : " + msg; 
            });
        }
    };
    
	this.registerToNodeJsServer();
    this.init();
	this.bindLien();
	this.bindNomSubmit();
	this.bindDeco();

};

mainScript();