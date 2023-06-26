const Joi = require("joi");
const {isEmailVerified} = require("./existence");
const respone = require("../../utils/respone");

const options = {
	abortEarly: false,
	allowUnknown: true,
	stripUnknown: true,
	errors: {
		wrap: {
			label: ""
		}
	}
};


module.exports = {
	resendEmailVerification: async (req, res, next) => {
		const querySchema = Joi.object({
			token: Joi.string().required()
		});

		const bodySchema = Joi.object({
			email: Joi.string().email().required()
				.external(async (value) => {
					return await isEmailVerified(value);
				})
		});

		try {
			req.query = await querySchema.validateAsync(req.query, options);
			req.body = await bodySchema.validateAsync(req.body, options);
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	},

	verifyAccount: async (req, res, next) => {
		const schema = Joi.object({
			token: Joi.string().required()
		});

		try {
			req.query = await schema.validateAsync(req.query, options);
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	},

	resetPassword: async (req, res, next) => {
		const querySchema = Joi.object({
			token: Joi.string().required()
		});

		const bodySchema = Joi.object({
			new_password: Joi.string().min(8).max(30).required(),
			confirm_new_password: Joi.string().required()
				.valid(Joi.ref("new_password"))
				.messages({"any.only": "password not match!"})
		});

		try {
			req.query = await querySchema.validateAsync(req.query, options);
			req.body = await bodySchema.validateAsync(req.body, options);
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	},
};