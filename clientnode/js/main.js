let mainScript = function(){


	this.nodeJSclient = null;
	this.registerToNodeJsServer = function() {

		this.nodeJSclient = new nodeJSclient();
		// Connexion au serveur
		this.nodeJSclient.connectServer();
		
	};


	this.registerToNodeJsServer();
	
};


mainScript();