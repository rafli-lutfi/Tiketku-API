const Joi = require("joi");

module.exports = {
	readNotif: {
		parameterSchema : Joi.object({
			id: Joi.number().min(1).required().options({convert: true}),
		}),
	}
};