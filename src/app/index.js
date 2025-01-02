/**
 * app/index.js
 * shrikant aher
 */



const { init: dbInit } = require('./db');
const { init: serverInit, port: serverPort } = require('./server');

module.exports = {
	dbInit,
	serverInit,
	serverPort,
};
