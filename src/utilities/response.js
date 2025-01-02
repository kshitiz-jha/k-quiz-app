/**
 * response.js
 * shrikant aher
 */



const Joi = require('joi');
const { pick } = require('./universalFunctions');

const validateInput = (schema) => (req, res, next) => {
	const validSchema = pick(schema, ['params', 'query', 'body']);
	const object = pick(req, Object.keys(validSchema));
	const { value, error } = Joi.compile(validSchema)
		.prefs({ errors: { label: 'key' } })
		.validate(object);

	if (error) {
		const errorMessage = error.details
			.map((details) => details.message)
			.join(', ');
		return sendResponse(req, res, 422, { error: errorMessage });
	}
	Object.assign(req, value);
	next();
};

const sendResponse = (req, res, status = 200, data = {}, meta = {}) => {
	res.status(status).send({
		status,
		success: status < 400 ? true : false,
		data,
		meta,
	});
};

module.exports = {
	validateInput,
	sendResponse,
};
