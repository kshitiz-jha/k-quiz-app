/**
 * services/index.js
 * shrikant aher
 */



module.exports = {
	Auth: require('./wrapperService')('Auth'),
	User: require('./wrapperService')('User'),
};
