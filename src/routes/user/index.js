/**
 * user/index.js
 * shrikant aher
 */



const isLoggedIn = require('./isLoggedIn');
const login = require('./login');
const logout = require('./logout');
const verifyOtp = require('./verifyOtp');

module.exports = [
	isLoggedIn,
	login,
	logout,
	verifyOtp,
];
