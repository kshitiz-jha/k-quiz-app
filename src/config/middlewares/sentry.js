/**
 * middlewares/sentry.js
 * shrikant aher
 */



const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const { server: { SENTRY_DSN } } = require('../../constants');

const initialiseSentry = (app) => {
	Sentry.init({
		dsn: SENTRY_DSN,
		integrations: [
			// enable HTTP calls tracing
			new Sentry.Integrations.Http({ tracing: true }),
			// enable Express.js middleware tracing
			new Tracing.Integrations.Express({ app }),
		],
    
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
	});

	return Sentry;
};

module.exports = { initialiseSentry };
