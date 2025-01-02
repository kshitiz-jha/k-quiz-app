/**
 * login.js
 * shrikant aher
 */



const { randomInt } = require('crypto');

const { User: UserService, Auth: AuthService } = require('../../services');
const { UniversalFunctions: { generateToken, deleteUnnecessaryUserData } } = require('../../utilities');

const login = async (payload) => {
	let { countryCode, phoneNumber } = payload;
	if (countryCode.charAt(0) !== '+') countryCode = '+'.concat(countryCode);

	let user = await UserService.getOne({ countryCode, phoneNumber });
	if (!user) user = await UserService.create(payload);

	const token = generateToken({ _id: user._id }, '300s');
	user.accessToken = token;

	const otp = randomInt(100000, 999999);
	const validTill = new Date(Date.now() + (5 * 60 * 1000)); // 5 minutes
	await AuthService.updateOne({ userId: user._id }, { otp, validTill }, { upsert: true });

	// TODO: Send OTP on Phone Number

	return deleteUnnecessaryUserData(user);
};

module.exports = login;
