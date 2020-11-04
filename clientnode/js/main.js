let mainScript = function(){


	this.nodeJSclient = null;
	this.lien = document.getElementById('lien');
	this.resultat = document.querySelectorAll('div.resultat');
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
				
				that.resultat[0].innerHTML=msg;
			});
			
        }
    };

    

	this.registerToNodeJsServer();

	this.bindLien();


	
};


mainScript();