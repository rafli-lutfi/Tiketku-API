const Joi = require("joi");
const existence = require("./existence");

const options = {
	abortEarly: false,
	allowUnknown: true,
	stripUnknown: true,
	errors: {
		escapeHtml: true,
		wrap: {
			label: ""
		}
	}
};

const responeError = (res, error) => {
	return res.status(400).json({
		status: false,
		message: `Validation error: ${error.details.map(x => x.message).join(", ")}`,
		data: null
	});
};

module.exports = {
	resendEmailVerification: async (req, res, next) => {
		const querySchema = Joi.object({
			token: Joi.string().required()
		});

		const bodySchema = Joi.object({
			email: Joi.string().email().required().external(async (value) => {
				existence.isEmailVerified(value);
			})
		});

		try {
			await querySchema.validateAsync(req.query, options);
			await bodySchema.validateAsync(req.body, options);
			next();
		} catch (error) {
			responeError(res, error);
		}
	},

	verifyAccount: async (req, res, next) => {
		const schema = Joi.object({
			token: Joi.string().required()
		});

		try {
			await schema.validateAsync(req.query, options);
			next();
		} catch (error) {
			responeError(res, error);
		}
	},

	resetPassword: async (req, res, next) => {
		const querySchema = Joi.object({
			token: Joi.string().required()
		});

		const bodySchema = Joi.object({
			new_password: Joi.string().min(8).max(30).required(),
			confirm_new_password: Joi.string().required().valid(Joi.ref("new_password"))
				.messages({"any.only": "password not match!"})
		});

		try {
			await querySchema.validateAsync(req.query, options);
			await bodySchema.validateAsync(req.body, options);
			next();
		} catch (error) {
			responeError(res, error);
		}
	},
};