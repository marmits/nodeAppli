const Logger = require('../Logger');
const {clients} = require('../../server');

/**
 * Retourne le client ou undifined en fonction du client_id recherché
 * @param client_id
 * @return Client|undefined
 */
function getClientById(client_id)
{
    return clients.find((client) => {
        return parseInt(client.idclient) === parseInt(client_id);
    });
}



function verifyRequestParameters(request,params)
{
    let missingParameters = [];

    params.body.forEach((param) => {
       if(request.body[param] === undefined) {
           missingParameters.push(param);
       }
    });

    if(missingParameters.length > 0) {
        return Promise.reject(`Les paramètres de requêtes ${missingParameters.join(', ')} sont manquants.`);
    }


    return Promise.resolve();
}


/**
 * Supprime le client des clients du serveur
 * @param agent_id
 * @return {Promise<unknown>}
 */
function removeClient(agent_id)
{
    return new Promise((resolve, reject) => {
        let clientIndex = clients.findIndex((client) => {
            return (client.agentId === agent_id);
        });

        if(clientIndex !== undefined) {
            clients.splice(clientIndex,1);
            return resolve();
        }

        return reject("Le client n'a pas été trouver.");
    })
}

module.exports = {
    getClientById,
    verifyRequestParameters,
    removeClient
};