/**
 * db.js
 * shrikant aher
 */

const mongoose = require('mongoose');
const Redis = require('ioredis');

const {
	db: { dbOptions, mongoUri, redisUrl },
} = require('../config');
const getLogger = require('../utilities/logger');
const logger = getLogger(__filename);

const { name } = require('../../package.json');

const init = async () => {
	mongoose.connection.once('open', async () => {
		logger.info('MongoDB event open');
		logger.debug(`MongoDB connected to ${mongoUri}`);

		mongoose.connection.on('connected', () => {
			logger.info('MongoDB event connected');
		});

		mongoose.connection.on('disconnected', () => {
			logger.warn('MongoDB event disconnected');
		});

		mongoose.connection.on('reconnected', () => {
			logger.info('MongoDB event reconnected');
		});

		mongoose.connection.on('error', (error) => {
			logger.error('MongoDB event error===>', error, '---MongoDB event error');
		});

		try {
			// Bootstrap dummy data
		} catch (error) {
			logger.error('Mongo Syntax Error===>', error, '---Mongo Syntax Error');
		}
	});

	try {
		await mongoose.connect(mongoUri, dbOptions);
	} catch (error) {
		logger.error(`Mongoose connection error ${error}`);
	}

	

	/** Uncomment to run on local */
	const redisClient = Redis.createClient({ url: redisUrl, name: name });

	
	redisClient.on('connect', () => {
		logger.info('redisClient Connected to Redis cluster');
	});
	redisClient.on('error', (err) => {
		logger.error('Error:', err);
	});

	return { mongoose, redisClient };
};

module.exports = {
	init,
};
