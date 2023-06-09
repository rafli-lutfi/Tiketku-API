const Joi = require("joi");
const {isFlightExist} = require("./existence");

const validSeatClass = ["ECONOMY", "BUSINESS", "FIRST CLASS"];
const validAgeGroup = ["adult", "child", "infant"];
const validTitle = ["mr", "mrs"];

module.exports = {
	getDetail: {
		parameterSchema: Joi.object({
			order_id: Joi.number().min(1).required().options({convert: true})
		}),
	},

	create: {
		bodySchema: Joi.object({
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
		})
	}
};