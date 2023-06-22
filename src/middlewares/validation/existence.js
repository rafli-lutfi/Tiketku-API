const Joi = require("joi");
const {User} = require("../../db/models");

const customErrorJoi = (message, field) => {
	throw new Joi.ValidationError(
		message,
		[
			{
				message: message,
				path: [field],
				type: `string.${field}`,
				context: {
					key: field,
					label: field,
				},
			}
		],
	);
};

module.exports = {
	isEmailExist: async (email) => {
		const user = await User.findOne({
			where: {email: email},
			attributes: ["id"]
		});
		if (user) {
			customErrorJoi("email already used!", "email");
		} 

		return false;
	},

	isEmailVerified: async (email) => {
		const user = await User.findOne({
			where: {email: email},
			attributes: ["email"]
		});
		if(!user){
			customErrorJoi("you're not register yet", "email");
		}

		if(user.email_verified == true){
			customErrorJoi("your account already verified", "email");
		}

		return false;
	},

	
};