const Joi = require("joi");
const {isOrderExist} = require("./existence");

module.exports = {
	confirmPayment: {
		bodySchema : Joi.object({
			order_id: Joi.number().min(1).required().external(async (value) => await isOrderExist(value)),
			payment_type: Joi.string().min(1).required()
		}),
	}
};