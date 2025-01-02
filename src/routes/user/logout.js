/**
 * logout.js
 * shrikant aher
 */



const { Router } = require('express');
const router = new Router();
const { Auth: { isLoggedIn } } = require('../../middlewares');
const { User: { logout } } = require('../../controllers');
const { Response: { sendResponse } } = require('../../utilities');

router.post('/logout', isLoggedIn(), async (req, res, next) => {
	try {
		await logout(req);
		return sendResponse(req, res, 204);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
