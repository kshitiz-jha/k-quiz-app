/**
 * db.js
 * shrikant aher
 */



const { db: { MONGO_CLUSTER_URI, REDIS_URL } } = require('../constants');

module.exports = {
	mongoUri: MONGO_CLUSTER_URI,
	redisUrl: REDIS_URL,
	dbOptions: {
		connectTimeoutMS: 1000,
	},
};
