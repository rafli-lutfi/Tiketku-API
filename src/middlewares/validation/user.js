const Joi = require("joi");
const {isEmailExist} = require("./existence");

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
	register: async (req, res, next) => {
		const schema = Joi.object({
			fullname: Joi.string().min(3).max(50).required(),
			password: Joi.string().min(8).max(30).required(),
			email: Joi.string().email().required().external(async (value) => {
				return await isEmailExist(value);
			}),
			phone: Joi.string().regex(/^[0-9\-\\+]+$/).min(9).max(15).required()
		});
		try {
			await schema.validateAsync(req.body, options);
			next();
		} catch (error) {
			responeError(res, error);
		}
	},

	login: async (req, res, next) => {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		});
		
		try {
			await schema.validateAsync(req.body, options);
			next();
		} catch (error) {
			responeError(res, error);
		}
	},

	updateProfile: async (req, res, next) => {
		const schema = Joi.object({
			fullname: Joi.string().min(3).max(50).optional(),
			email: Joi.string().email().optional(),
			phone: Joi.string().regex(/^[0-9\-\\+]+$/).min(9).max(15).optional(),
			avatar: Joi.string().optional()
		});
		try {
			await schema.validateAsync(req.body, options);
			next();
		} catch (error) {
			responeError(res, error);
		}
	},

	forgotPassword: async (req, res, next) => {
		const schema = Joi.object({
			email: Joi.string().email().required(),
		});
		try {
			await schema.validateAsync(req.body, options);
			next();
		} catch (error) {
			responeError(res, error);
		}
	},


};