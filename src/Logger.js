const moment = require('moment');
const chalk = require('chalk');

class Logger
{
    static formatMessage(action,message,socket)
    {
        if(socket !== null) {
             return "[" + chalk.hex('#58A509')(moment(new Date()).format("DD/MM/YYYY HH:mm:ss:SSS")) + "] " + "[IP: " + socket.handshake.address + "] " + chalk.yellowBright(action) + " : " + message;
        } else {
            return "[" + chalk.hex('#58A509')(moment(new Date()).format("DD/MM/YYYY HH:mm:ss:SSS")) + "] " + chalk.yellowBright(action) + " : " + message;
        }
    }

    static log (action,message, socket = null)
    {
        console.log(Logger.formatMessage(action,message,socket));
    }

    static error (action,message, socket = null)
    {
        console.error(Logger.formatMessage(action,message,socket));
    }

    static warning (action,message, socket = null)
    {
        console.warn(Logger.formatMessage(action,message,socket));
    }
}

module.exports = {
    log : Logger.log,
    error: Logger.error,
    warning: Logger.warning
};