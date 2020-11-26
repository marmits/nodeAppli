
module.exports = class Client
{
    constructor()
    {
        this._idclient = null;
        this._login = null;
        this._socket = null;

    }

    get socket() {
        return this._socket;
    }

    set socket(value) {
        this._socket = value;
    }

    get clientId() {
        return this._idclient;
    }

    set clientId(value) {
        this._idclient = value;
    }


};