/**
 * auth.js
 * shrikant aher
 */



const { Auth: AuthService } = require('../services');
const {
	UniversalFunctions: { verifyToken },
	Response: { sendResponse },
} = require('../utilities');
const { i18n: { errorMessages: { INVALID_TOKEN } } } = require('../constants');

const isLoggedIn = (checkTokenInDB = true) => async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		const token = authorization?.split(' ')[1];
		if (token) {
			if (checkTokenInDB) {
				const auth = await AuthService.getOne({ token });
				if (!auth) return sendResponse(req, res, 401, { error: INVALID_TOKEN });
			}
			const user = await verifyToken(token);
			if (!user) return sendResponse(req, res, 401, { error: INVALID_TOKEN });

			req.user = user;
			return next();
		}
		sendResponse(req, res, 401, { error: INVALID_TOKEN });
	} catch (error) {
		sendResponse(req, res, 401, { error: INVALID_TOKEN });
	}
};

module.exports = {
	isLoggedIn,
};
