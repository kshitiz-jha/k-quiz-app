/**
 * login.js
 * shrikant aher
 */



const { Router } = require('express');
const router = new Router();

const { User: { loginSchema } } = require('../../validations');
const { User: { login } } = require('../../controllers');
const { Response: { validateInput, sendResponse } } = require('../../utilities');

router.post('/login', validateInput(loginSchema), async (req, res, next) => {
	try {
		const data = await login(req.body);
		sendResponse(req, res, 200, data);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
