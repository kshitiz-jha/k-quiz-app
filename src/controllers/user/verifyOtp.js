/**
 * verifyOtp.js
 * shrikant aher
 */



const {
	Auth: AuthService,
	User: UserService,
} = require('../../services');
const { UniversalFunctions: { generateToken } } = require('../../utilities');

const verifyOtp = async (req) => {
	const user = req.user;
	const payload = req.body;
	if (payload.countryCode.charAt(0) !== '+') payload.countryCode = '+'.concat(payload.countryCode);

	const auth = await AuthService.getOne({ userId: user._id });
	if (
		user.countryCode !== payload.countryCode ||
		user.phoneNumber !== payload.phoneNumber ||
		!auth ||
		(auth && auth.otp !== payload.otp)
	) throw new Error('Invalid OTP. Kindly try again.');

	const token = await generateToken({ _id: user._id });
	const validTill = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours

	await AuthService.updateOne({ userId: user._id }, {
		otp: null,
		validTill,
		token,
	}, { upsert: true });
	await UserService.updateOne({ _id: user._id }, { isActive: true });

	user.accessToken = token;

	return user;
};

module.exports = verifyOtp;
