/**
 * user.js
 * shrikant aher
 */



const Joi = require('joi');

const loginSchema = {
	body: Joi.object().keys({
		countryCode: Joi.string().trim().required().min(2).label('Country Code'),
		phoneNumber: Joi.string().trim().required().min(10).max(10).label('Phone Number'),
	}),
};

const verifyOtpSchema = {
	body: Joi.object().keys({
		countryCode: Joi.string().trim().required().min(2).label('Country Code'),
		phoneNumber: Joi.string().trim().required().min(10).max(10).label('Phone Number'),
		otp: Joi.string().trim().required().min(6).max(6).label('OTP'),
	}),
};

module.exports = {
	loginSchema,
	verifyOtpSchema,
};
