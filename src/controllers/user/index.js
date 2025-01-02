/**
 * user/index.js
 * shrikant aher
 */



const login = require('./login');
const logout = require('./logout');
const verifyOtp = require('./verifyOtp');

module.exports = {
	login,
	logout,
	verifyOtp,
};
