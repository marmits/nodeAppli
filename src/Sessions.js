const session = require('express-session');
const FileStore = require('session-file-store')(session);
const environment = require('./config/environment');
const configuration = require(`../config/${environment.jsonConfigFile}`);
const portServerNodejs = configuration.address.portnodejs;

const tmpDirectory = configuration.session.rep;



const fileStoreOptions = {path:tmpDirectory};



/*
module.exports.SessionsAppli = function() 
{
    return (req,res,next) => {
		session({
			store: new FileStore(fileStoreOptions),
			secret: 'ssshhhhh',
			saveUninitialized: true,
			resave: true

		});
        next();
    };
};
*/

module.exports.SessionsAppli =
{
	sessions : session({
		store: new FileStore(fileStoreOptions),
		secret: 'ssshhhhh',
		saveUninitialized: true,
		resave: true

	})
};

//app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));