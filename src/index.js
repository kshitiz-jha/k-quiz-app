/**
 * index.js
 * shrikant aher
 */


global.__basedir = __dirname;

const nodeVersion = parseInt(process.versions.node);
if (nodeVersion < 18) throw Error('Kindly upgrade Node version to 18 or higher');

const { dbInit , serverInit, serverPort } = require('./app');
const getLogger = require('./utilities/logger');
const logger = getLogger(__filename);

(async () => {
	try {
		const { redisClient, logging, mongoose } = await dbInit();
		const { connections: [{ host, port, name }] } = mongoose;
		logger.info(`Database ${name} connected to ${host} at port ${port}`);
		global.logging = logging;
		global.redisClient = redisClient;

		const server = await serverInit();
		server.listen(serverPort, () => {
			logger.info(`Server listening at http://localhost:${serverPort}`);
		});
	} catch (error) {
		logger.error('Fatal Error:::***>', (error), '---Fatal Error');
	}
})();

process
	.on('unhandledRejection', async (err) => {
		logger.error('unhandledRejection===>', err);
		if (global.sourceMongoClient?.close && typeof global.sourceMongoClient.close === 'function') await global.sourceMongoClient.close();
		if (global.redisClient) await global.redisClient.disconnect?.();
		
		process.exit(0);
	})
	.on('uncaughtException', async (err) => {
		logger.error('uncaughtException===>', err);
		if (global.sourceMongoClient?.close && typeof global.sourceMongoClient.close === 'function') await global.sourceMongoClient.close();
		if (global.redisClient) await global.redisClient.disconnect?.();
		process.exit(1);
	});
