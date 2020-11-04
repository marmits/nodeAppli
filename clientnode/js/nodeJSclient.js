class nodeJSclient {

	constructor (qui = self.ESSAI) {

       
        this.nodejs_server = "http://127.0.0.1:1337";
        this.socketio = null;
        this.qui = qui;

        // Callbacks à définir pour gérer les actions
        this.onConnectionSuccessCallback = null;

    }

    connectServer ()
    {
        let that = this;
        console.log("connexion au serveur nodejs ...");

        this.socketio = io.connect(this.nodejs_server, {
            transports: ['websocket'],
            upgrade: false
        });

        this.socketio.on("connect" , () => {

            console.log("connexion au serveur nodejs ... OK");

            console.log("envoi de la configuration client au serveur nodejs ...");


            /*this.socketio.emit('setConfig', "config test");
            console.log("envoi de la configuration client au serveur nodejs ... OK");

            if(typeof that.onConnectionSuccessCallback === 'function') {
                that.onConnectionSuccessCallback();
            }
            */

         });
    }


    static get ESSAI(){
        return "geoffroy";
    }

}

