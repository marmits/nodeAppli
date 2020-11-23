const Logger = require('./Logger');
const Moment = require('moment');
const database = require('./Database');
const environment = require('../src/config/environment');
const configuration = require(`../config/${environment.jsonConfigFile}`);

module.exports = class Users
{

    async resetConnection (){
        return new Promise((resolve, reject) => {
            let sql = `UPDATE user set online = 0 WHERE user.id > 0`;
            database.query(sql, (error, result) => {
                if(error) {
                    Logger.log('User', 'Erreur SQL lors de du reset connection user: ' + error + ' SQL=' + error.sql);
                    return reject(error.sql);
                }
                resolve(result);
            });
        });
    };

    checkUser (nom){
         return new Promise((resolve, reject) => {
            let sql = `
                SELECT u.* from user u where u.online = 0 AND u.nom = ?
                
            `;
            database.query(sql,[nom], (error, result) => {
                if(error) {
                    Logger.log('User', 'Erreur SQL lors de la selection du user : ' + error + ' SQL=' + error.sql, nom);
                    return reject(error);
                }
                let user = [];
                if(result.length > 0) {
                    result.forEach((userResult) => {
                        
                        user.push({
                            'id' : userResult.id,
                            'nom' : userResult.nom,
                            'pass' : userResult.pass,
                            'role' : userResult.role
                        });
                    });
                } else {
                    reject("Utilisateur inconnu ou déja connecté");
                }
                return resolve(user); 
            });
         });
    };

    getUserById (id){
         return new Promise((resolve, reject) => {
            database.query(`SELECT u.* from user u where u.id = ?`
                ,[id], (error, result) => {
                if(error) {
                    Logger.log('User', 'Erreur SQL lors de la selection du user : ' + error + ' SQL=' + error.sql, nom);
                    return reject(error);
                }
                let user = {};
                if(result.length > 0) {
                    result.forEach((userResult) => { 
                        user = {
                            'id' : userResult.id,
                            'nom' : userResult.nom,
                            'pass' : userResult.pass,
                            'role' : userResult.role
                        };
                    });
                }    
                return resolve(user); 
            });
         });
    };


    onlineUser (){
         return new Promise((resolve, reject) => {
            database.query(`
                SELECT u.* from user u where u.online = 1`, (error, result) => {
                if(error) {
                    Logger.log('User', 'Erreur SQL lors de la selection du user : ' + error + ' SQL=' + error.sql, nom);
                    return reject(error);
                }
                let user = [];
                if(result.length > 0) {
                    result.forEach((userResult) => { 
                        user.push({
                            'id' : userResult.id,
                            'nom' : userResult.nom,
                            'pass' : userResult.pass,
                            'role' : userResult.role
                        });
                    });
                }
                return resolve(user); 
            });

         });
    };

    async logActionInDatabase(clientData,action)
    {
        let user_id = clientData.infos.id;
        return new Promise((resolve, reject) => {
          
                database.query({
                    sql: `
                        INSERT INTO logs (id_client,date,action)
                        VALUE (?,?,?)`,
                    values: [
                        user_id,
                        Moment().format("YYYY-MM-DD HH:mm:ss"),
                        action
                    ]
                }, (error, result) => {

                    if(error) {
                        Logger.log('users', `Erreur SQL lors de l'insertion des logs : ${error}`,user_id);
                        return reject(error);
                    }

                });
                return resolve(clientData);
            /*} catch(err) {
                Logger.log('users', `Erreur SQL lors de l'insertion des logs : ${err}`,user_id);
                return false;
            }*/
        });
    };

    async updateStatut(user_id,statut)
    {
        return new Promise((resolve, reject) => {        
            database.query({
                sql: `
                    UPDATE user set online = ${statut} WHERE user.id = ${user_id}`
            }, (error, result) => {

                if(error) {
                    Logger.log('users', `Erreur SQL lors de l'insertion des logs : ${error}`,user_id);
                    return reject(error);
                }
                 return resolve(statut); 
            });                   
         });
    };

    // via client socketio
    setClients(user){
        return new Promise((resolve, reject) => {
            let clients = {};
            if(user.id !== undefined) {               
                
                clients.id = user.id;
                clients.nom = user.nom;
                clients.pass = user.pass;
                clients.role = user.role;
                return resolve(clients);
            }
            else{
                var error = "setClients failed , user is undefined";
                return reject(error);
            }        
        });
    };


};