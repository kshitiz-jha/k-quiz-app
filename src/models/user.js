/**
 * user.js
 * shrikant aher
 */



const { model, Schema } = require('mongoose');

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			default: '',
		},
		lastName: {
			type: String,
			default: '',
		},
		email: {
			type: String,
			unique: true,
			index: true,
			sparse: true,
		},
		countryCode: {
			type: String,
			required: function () { return this.phoneNumber && this.phoneNumber.length === 10; },
		},
		phoneNumber: {
			type: String,
			required: function () { return this.countryCode && this.countryCode.length === 10; },
			unique: true,
			index: true,
			sparse: true,
		},
		profileImage: {
			original: {
				type: String,
			},
			thumbnail: {
				type: String,
			},
		},
		isAdmin: {
			type: Boolean,
			default: false,
			index: true,
		},
		isActive: {
			type: Boolean,
			default: false,
			index: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
			index: true,
		},
		createdAt: {
			type: Number,
			// set: function (datetime) { Math.floor(new Date(datetime).now() / 1000) }
		},
		updatedAt: {
			type: Number,
		},
	},
	{
		// Make Mongoose use Unix time (seconds since Jan 1, 1970)
		timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
	},
);

module.exports = model('User', userSchema);
