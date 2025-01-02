/**
 * NotFoundError.js
 * shrikant aher
 */



class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NotFoundError';
	}
}

module.exports = NotFoundError;