const Joi = require("joi");
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
	convert: false
};


module.exports = {
	search: async (req, res, next) => {
		const schema = Joi.object({
			city: Joi.string().min(1).required(),
		});

		try {
			req.body = await schema.validateAsync(req.body, options);    
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	}
};