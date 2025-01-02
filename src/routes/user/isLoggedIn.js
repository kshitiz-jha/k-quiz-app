/**
 * isLoggedIn.js
 * shrikant aher
 */



const { Router } = require('express');
const router = new Router();

const { Auth: { isLoggedIn } } = require('../../middlewares');
const { Response: { sendResponse } } = require('../../utilities');

router.get('/isLoggedIn', isLoggedIn(), async (req, res, next) => {
	try {
		sendResponse(req, res, 200, req.user);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
