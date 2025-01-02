/**
 * verifyOtp.js
 * shrikant aher
 */



const { Router } = require('express');
const router = new Router();

const { User: { verifyOtpSchema } } = require('../../validations');
const { Auth: { isLoggedIn } } = require('../../middlewares');
const { User: { verifyOtp } } = require('../../controllers');
const { Response: { validateInput, sendResponse } } = require('../../utilities');

router.post('/verifyOtp', validateInput(verifyOtpSchema), isLoggedIn(false), async (req, res, next) => {
	try {
		const data = await verifyOtp(req);
		sendResponse(req, res, 200, data);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
