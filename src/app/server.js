/**
 * server.js
 * shrikant aher
 */



const express = require('express');
const cors = require('cors');
const getLogger = require('../utilities/logger');
const logger = getLogger(__filename);

const {
	server: { PORT, SENTRY_DSN },
	i18n: { errorMessages: { NOT_FOUND } },
} = require('../constants');

const {
	name,
} = require('../../package.json');

const {
	Response: { sendResponse },
} = require('../utilities');

const {
	errors: { NotFoundError, ValidationError },
	middlewares: {
		initialiseSentry,
		logRequestStart,
		logResponseBody,
	},
} = require('../config');

const init = () => {
	const app = express();
	app.use(express.json());
	app.use(cors());

	app.use('/public', express.static('public'));

	app.use(logRequestStart);
	app.use(logResponseBody);

	app.get('/', (req, res) => {
		res.status(200).send(
			`Welcome to <strong>${name}</strong>.`,
		);
	});

	const { User } = require('../routes');
	app.use('/v1', User);

	app.use((req, res) => {
		sendResponse(req, res, 404, { message: NOT_FOUND });
	});

	if (SENTRY_DSN) {
		const Sentry = initialiseSentry(app);
		app.use(Sentry.Handlers.errorHandler());
	}

	// eslint-disable-next-line no-unused-vars
	app.use((err, req, res, next) => {
		if (err instanceof NotFoundError) return sendResponse(req, res, 404, { error: err.message || err });
		if (err instanceof ValidationError) return sendResponse(req, res, 400, { error: err.message || err });
		if (process.env.NODE_ENV === 'development') logger.error('Server Error===>', err, '---Server Error');
		sendResponse(req, res, 500, { error: err.message || err });
	});

	return app;
};

module.exports = {
	init,
	port: PORT,
};
