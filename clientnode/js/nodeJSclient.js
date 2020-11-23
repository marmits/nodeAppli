class nodeJSclient {

	constructor (env = null, serveurAdress){
        this.nodejs_server = serveurAdress;
        this.socketio = null;
        this.env = env;
        if(env === null){
            this.env = this.ENVIRONNEMENT;
        }        
        // Callbacks à définir pour gérer les actions
        this.onConnectionSuccessCallback = null;
    }

    connectServer(clientId){
        let that = this;
        console.log("tentative de connexion au serveur nodejs ...");
   
        this.socketio = io.connect(this.nodejs_server, {
            transports: ['websocket'],
            upgrade: false
        });

        this.socketio.on("connect" , () => {            
             

            console.log("connexion au serveur nodejs ... OK");
            console.log(`Environnement : ${that.env}`);
            this.socketio.emit('setConfig', `${that.env}`, `${clientId}`);
            console.log("envoi de la configuration client au serveur nodejs ... OK");

            if(typeof that.onConnectionSuccessCallback === 'function') {
                that.onConnectionSuccessCallback();
            }
         }); 

        this.socketio.on("coupe", (reason) => {
            console.error(`Déconnexion du socket NodeJS : ${reason}`);
            //this.disconnectServer();
        });
    }

    disconnectServer()
    {
        
        this.socketio.close();
    }


    get ENVIRONNEMENT(){
        return "env init";
    }
}

