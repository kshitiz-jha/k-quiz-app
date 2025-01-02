/**
 * config/index.js
 * shrikant aher
 */



const errors = require('./errors');
const middlewares = require('./middlewares');
const db = require('./db');

module.exports = {
	errors,
	middlewares,
	db,
};
