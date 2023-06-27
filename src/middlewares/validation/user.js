const Joi = require("joi");
const {isEmailExist} = require("./existence");
const respone = require("../../utils/respone");

const options = {
	abortEarly: false,
	allowUnknown: true,
	stripUnknown: true,
	errors: {
		wrap: {
			label: ""
		}
	},
	convert: true
};


const validMimeType = ["image/png", "image/jpg", "image/jpeg"];

module.exports = {
	register: async (req, res, next) => {
		const schema = Joi.object({
			fullname: Joi.string().min(3).max(50).required(),

			password: Joi.string().min(8).max(30).required(),

			email: Joi.string().email().required()
				.external(async (value) => {
					return await isEmailExist(value);
				}),

			phone: Joi.string().regex(/^[0-9\-\\+]+$/).min(9).max(15).required()
		});

		try {
			req.body = await schema.validateAsync(req.body, options);
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	},

	login: async (req, res, next) => {
		const schema = Joi.object({
			email: Joi.string().email().required(),

			password: Joi.string().required(),
		});
		
		try {
			req.body = await schema.validateAsync(req.body, options);
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	},

	updateProfile: async (req, res, next) => {
		const schema = Joi.object({
			fullname: Joi.string().min(3).max(50).optional(),

			email: Joi.string().email().optional(),

			phone: Joi.string().regex(/^[0-9\-\\+]+$/).min(9).max(15).optional(),
		});

		const fileSchema = Joi.object({
			fieldname: Joi.string().valid("media").required(),
			originalname: Joi.string().required(),
			encoding: Joi.string().required(),
			mimetype: Joi.string().valid(...validMimeType).required(),
			buffer: Joi.binary().encoding("base64").required(),
			size: Joi.number().max(5000000).required()
		});

		try {
			if(req.file){
				req.file = await fileSchema.validateAsync(req.file, options);
				return next();
			}

			req.body = await schema.validateAsync(req.body, options);

			const {fullname, email, phone} = req.body;
			if(!fullname && !email && !phone) {
				return res.status(400).json({
					status: false,
					message: "fullname, email, or password, one of these must exist",
					data: null
				});
			}

			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	},

	forgotPassword: async (req, res, next) => {
		const schema = Joi.object({
			email: Joi.string().email().required(),
		});

		try {
			req.body = await schema.validateAsync(req.body, options);
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	},


};