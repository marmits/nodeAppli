class nodeJSclient {

	constructor (env = null) {
   
       
        this.nodejs_server = "http://127.0.0.1:1337";
        this.socketio = null;
        this.env = env;
        if(env === null){
            this.env = this.ENVIRONNEMENT;
        }
        

        // Callbacks à définir pour gérer les actions
        this.onConnectionSuccessCallback = null;

    }

    connectServer ()
    {
        let that = this;
        console.log("tentative de connexion au serveur nodejs ...");
        

        this.socketio = io.connect(this.nodejs_server, {
            transports: ['websocket'],
            upgrade: false
        });

        this.socketio.on("connect" , () => {

            console.log("connexion au serveur nodejs ... OK");
            console.log(`Environnement : ${that.env}`);
            this.socketio.emit('setConfig', "config test");
            console.log("envoi de la configuration client au serveur nodejs ... OK");

            if(typeof that.onConnectionSuccessCallback === 'function') {
                that.onConnectionSuccessCallback();
            }
            

         });
    }


    get ENVIRONNEMENT(){
        return "geoffroy";
    }

}

