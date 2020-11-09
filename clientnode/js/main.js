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

    this.init = function(){
    	let that = this;
    	var span = document.createElement("SPAN");
    	that.main[0].appendChild(span).innerHTML="test"; 
    	that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], true);
    	that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
    }

	this.registerToNodeJsServer = function() {
		this.nodeJSclient = new nodeJSclient();
		// Connexion au serveur
		this.nodeJSclient.connectServer();
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
            this.nodeJSclient.socketio.on('clicklien', function(msg){
				var div = document.createElement("DIV");
				that.resultat[0].appendChild(div).innerHTML=msg; 
			});
        }
    };
    this.bindNomSubmit = function(){
    	let that = this;
    	if(that.submit !== undefined){
    		that.submit.addEventListener('click', function(e){
    			e.stopPropagation();
                e.preventDefault(); 
                that.nodeJSclient.socketio.emit('submitNom', that.nom.value);
                return false;                           
    		});
    		this.nodeJSclient.socketio.on('submitNom', function(user){

    			if(user !== null){


    				var div = document.createElement("DIV");
					that.resultat[0].appendChild(div).innerHTML=user.id_client;

					var div = document.createElement("DIV");
					that.resultat[0].appendChild(div).innerHTML=user.id + " " + user.nom + " " + user.role + " connecté"; 
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

                that.nodeJSclient.socketio.emit('logout', "test");
                return false;                           
    		});
    		this.nodeJSclient.socketio.on('logout', function(data){
    			if(data === 1){
    				that.setElementVisibility(that.main[0].querySelectorAll('div.login')[0], true);
    				that.setElementVisibility(that.main[0].querySelectorAll('div.deconnect')[0], false);
    				var div = document.createElement("DIV");
					that.resultat[0].appendChild(div).innerHTML= " déconnecté";
    			}
    			
			});
    	}
    };
    this.init();
	this.registerToNodeJsServer();
	this.bindLien();
	this.bindNomSubmit();
	this.bindDeco();

};

mainScript();