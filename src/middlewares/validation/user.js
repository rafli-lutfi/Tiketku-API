const Joi = require("joi");
const {isEmailExist} = require("./existence");

const validMimeType = ["image/png", "image/jpg", "image/jpeg"];

module.exports = {
	register: {
		bodySchema: Joi.object({
			fullname: Joi.string().min(3).max(50).required(),

			password: Joi.string().min(8).max(30).required(),

			email: Joi.string().email().required()
				.external(async (value) => {
					return await isEmailExist(value);
				}),

			phone: Joi.string().regex(/^[0-9\-\\+]+$/).min(9).max(15).required()
		})
	},

	login: {
		bodySchema: Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		})
	},

	updateProfile: {
		bodySchema: Joi.object({
			fullname: Joi.string().min(3).max(50).optional(),
			email: Joi.string().email().optional(),
			phone: Joi.string().regex(/^[0-9\-\\+]+$/).min(9).max(15).optional(),
		}),

		fileSchema : Joi.object({
			fieldname: Joi.string().valid("media").required(),

			originalname: Joi.string().required(),

			encoding: Joi.string().required(),

			mimetype: Joi.string().valid(...validMimeType).required(),

			buffer: Joi.binary().encoding("base64").required(),

			size: Joi.number().max(5000000).required()
		})
	},

	forgotPassword: {
		bodySchema: Joi.object({
			email: Joi.string().email().required(),
		})
	},

};