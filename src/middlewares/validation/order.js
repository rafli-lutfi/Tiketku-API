const Joi = require("joi");
const {isFlightExist} = require("./existence");

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

const validSeatClass = ["ECONOMY", "BUSSINESS", "FIRST CLASS"];
const validAgeGroup = ["adult", "child", "infant"];
const validTitle = ["mr", "mrs"];

module.exports = {
	getDetail: async (req, res, next) => {
		const schema = Joi.object({
			order_id: Joi.number().min(1).required().options({convert: true})
		});

		try {
			req.params = await schema.validateAsync(req.params, options);    
			next();
		} catch (error) {
			return responeError(res, error);
		}
	},

	create: async (req, res, next) =>{
		const schema = Joi.object({
			flight_id: Joi.number().min(1).required().external(async (value) => {
				return await isFlightExist(value);
			}), 

			adult: Joi.number().min(1).required(),

			child: Joi.number().min(0).required(),

			infant: Joi.number().min(0).required(),

			passengers: Joi.array().items(
				Joi.object({
					fullname: Joi.string().min(1).max(50).required(),
					age_group: Joi.string().min(1).valid(...validAgeGroup).required(),
					title: Joi.string().min(1).valid(...validTitle).required(),
					birthdate: Joi.date().required().options({convert: true}),
					nationality: Joi.string().min(1).required(),
					ktp: Joi.string().alphanum().required()
				})
			).required(),

			seat_class: Joi.string().alphanum().valid(...validSeatClass).required()
		});

		try {    
			req.boy = await schema.validateAsync(req.body, options);

			next();
		} catch (error) {
			return responeError(res, error);
		}
	}
};