const Joi = require("joi");

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
	readNotif: async (req, res, next) => {
		const schema = Joi.object({
			id: Joi.number().min(1).required().options({convert: true}),
		});

		try {
			req.params = await schema.validateAsync(req.params, options);    
			next();
		} catch (error) {
			responeError(res, error);
		}
	}
};