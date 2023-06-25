const Joi = require("joi");
const {isOrderExist} = require("./existence");

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

const responeError = (res, error) => {
	return res.status(400).json({
		status: false,
		message: `Validation error: ${error.details.map(x => x.message).join(", ")}`,
		data: null
	});
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
			responeError(res, error);
		}
	}
};