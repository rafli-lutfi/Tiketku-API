const Joi = require("joi");
const {isOrderExist} = require("./existence");
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
	confirmPayment: async (req, res, next) => {
		const schema = Joi.object({
			order_id: Joi.number().min(1).required().external(async (value) => await isOrderExist(value)),
			payment_type: Joi.string().min(1).required()
		});

		try {
			req.body = await schema.validateAsync(req.body, options);
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	}
};