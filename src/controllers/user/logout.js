/**
 * logout.js
 * shrikant aher
 */



const { Auth: AuthService } = require('../../services');

const logout = async (req) => {
	const { authorization } = req.headers;
	const token = authorization?.split(' ')[1];
	await AuthService.deleteOne({ token });
};

module.exports = logout;
