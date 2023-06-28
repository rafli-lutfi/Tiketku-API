const Joi = require("joi");

module.exports = {
	search: {
		bodySchema : Joi.object({
			city: Joi.string().min(1).required(),
		}),
	}
};