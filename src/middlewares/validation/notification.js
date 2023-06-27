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
	readNotif: async (req, res, next) => {
		const schema = Joi.object({
			id: Joi.number().min(1).required().options({convert: true}),
		});

		try {
			req.params = await schema.validateAsync(req.params, options);    
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	}
};