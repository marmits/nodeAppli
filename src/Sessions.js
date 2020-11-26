const session = require('express-session');
const FileStore = require('session-file-store')(session);
const environment = require('./config/environment');
const configuration = require(`../config/${environment.jsonConfigFile}`);
const portServerNodejs = configuration.address.portnodejs;

const tmpDirectory = configuration.session.rep;
const fileStoreOptions = {path:tmpDirectory,logFn: function(){}};


module.exports.SessionsAppli =
{
	sessions : session({
		store: new FileStore(fileStoreOptions),
		secret: 'ssshhhhh',
		saveUninitialized: true,
		resave: true

	})
};
