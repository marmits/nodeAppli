const environment = require('../src/config/environment');
const configuration = require(`../config/${environment.jsonConfigFile}`);
const Mysql = require('mysql');

let _connection = null;

function createConnection() {

    _connection = Mysql.createPool({
        host : configuration.databases.nodeappli.host,
        user : configuration.databases.nodeappli.user,
        password : configuration.databases.nodeappli.pwd,
        database : configuration.databases.nodeappli.database
    });
}

if(_connection === null) {
    createConnection();
}

module.exports = _connection;

