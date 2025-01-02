/**
 * middlewares/req-res-interceptor.js
 * shrikant aher
 */

const getLogger = require('../../utilities/logger');
const logger = getLogger(__filename);


const { token } = require('gen-uid');
 
// Function to choose console as per statusCode
const getLoggerForStatusCode = (statusCode) => {
	if (statusCode >= 500) {
		return logger.error.bind(logger);
	}
	if (statusCode >= 400) {
		return logger.warn.bind(logger);
	}

	return logger.info.bind(logger);
};
 
// Function to log Request Payload
const logRequestStart = (req, res, next) => {
	req.requestId = token(true).substr(0, 8);
	let payload = {};
	switch (req.method) {
	case 'GET':
	case 'DELETE':
		payload = req.query;
		break;
	case 'POST':
	case 'PUT':
		payload = req.body;
		break;
	default:
		break;
	}

	const cleanup = () => {
		res.removeListener('finish', logFn);
		res.removeListener('close', abortFn);
		res.removeListener('error', errorFn);
	};
	
		
	
	
	const logFn = () => {
		cleanup();
		const logger = getLoggerForStatusCode(res.statusCode);
		logger(`[${req.requestId}] ${req.path} ${JSON.stringify(payload)} ${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
	};

	const abortFn = () => {
		cleanup();
		logger.warn(`[${req.requestId}] ${req.path} ${JSON.stringify(payload)} Request aborted by the client`);
	};

	const errorFn = (err) => {
		cleanup();
		logger.error(`[${req.requestId}] ${req.path} ${JSON.stringify(payload)} Request pipeline error: ${err}`);
	};

	res.on('finish', logFn); // successful pipeline (regardless of its response)
	res.on('close', abortFn); // aborted pipeline
	res.on('error', errorFn); // pipeline internal error

	next();
};

// Function to log Reposnse Body
const logResponseBody = (req, res, next) => {
	const oldWrite = res.write,
		oldEnd = res.end;

	const chunks = [];

	res.write = function (chunk) {
		chunks.push(chunk);
		return oldWrite.apply(res, arguments);
	};

	res.end = function (chunk) {
		if (chunk) chunks.push(chunk);
		const body = Buffer.concat(chunks).toString('utf8');
		logger.info(`[${req.requestId}] ${req.path} Response: ${body}`);

		
		oldEnd.apply(res, arguments);
	};

	next();
};

module.exports = {
	logRequestStart,
	logResponseBody,
};
