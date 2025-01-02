/**
 * middlewares/index.js
 * shrikant aher
 */



const { logRequestStart, logResponseBody } = require('./req-res-interceptor');
const { initialiseSentry } = require('./sentry');

module.exports = {
	logRequestStart,
	logResponseBody,
	initialiseSentry,
};
