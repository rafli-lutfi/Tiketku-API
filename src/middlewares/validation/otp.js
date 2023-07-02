const Joi = require("joi");
const {isEmailVerified} = require("./existence");

module.exports = {
	resendEmailVerification: {
		querySchema : Joi.object({
			token: Joi.string().required()
		}),

		bodySchema : Joi.object({
			email: Joi.string().email().required()
				.external(async (value) => {
					return await isEmailVerified(value);
				})
		}),
	},

	verifyAccount: {
		querySchema : Joi.object({
			token: Joi.string().required()
		}),
	},

	resetPassword: {
		querySchema : Joi.object({
			token: Joi.string().required()
		}),

		bodySchema : Joi.object({
			new_password: Joi.string().min(8).max(30).required(),
			confirm_new_password: Joi.string().required()
				.valid(Joi.ref("new_password"))
				.messages({"any.only": "password not match!"})
		}),
	},
};