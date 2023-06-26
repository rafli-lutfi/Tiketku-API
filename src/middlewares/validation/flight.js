const Joi = require("joi");
const moment = require("moment-timezone");
const {TZ = "Asia/Jakarta"} = process.env;
const {isFlightExist, isDepartureAirportExist, isArrivalAirportExist} = require("./existence");
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

const dateNow = moment().tz(TZ).format("YYYY-MM-DD");
const validSortBy = ["departure_time", "price", "arrival_time", "duration"];
const validSortType = ["ASC", "DESC"];
const validSeatClass = ["ECONOMY", "BUSSINESS", "FIRST CLASS"];

module.exports = {
	search: async (req, res, next) => {
		const querySchema = Joi.object({
			sort_by: Joi.string().min(1).optional()
				.valid(...validSortBy)
				.default("departure_time"),

			sort_type: Joi.string().alphanum().optional().
				valid(...validSortType)
				.default("ASC"),

			page: Joi.number().min(1).default(1).optional(),

			per_page: Joi.number().min(1).default(25).optional()
		});

		const bodySchema = Joi.object({
			departure_airport_city : Joi.string().min(1).required()
				.external(async (value) => {
					return await isDepartureAirportExist(value);
				}), 

			arrival_airport_city: Joi.string().min(1).required()
				.external(async (value) => {
					return await isArrivalAirportExist(value);
				}), 

			date: Joi.date().min(dateNow).required().
				options({convert: true}).
				messages({"date.min": "The selected date has already passed"}), 

			seat_class: Joi.string().min(1).valid(...validSeatClass).required(), 

			adult: Joi.number().min(1).required(), 

			child: Joi.number().min(0).required(), 

			infant: Joi.number().min(0).required(),
		});

		try {
			req.query = await querySchema.validateAsync(req.query, options);
			req.body = await bodySchema.validateAsync(req.body, options);
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	},

	detail: async (req, res, next) => {
		const schema = Joi.object({
			flight_id: Joi.number().min(1).required()
				.external(async (value) => {
					return await isFlightExist(value);
				}),

			seat_class: Joi.string().min(1).valid(...validSeatClass).required(),

			adult: Joi.number().min(1).required(),

			child: Joi.number().min(0).required(),

			infant: Joi.number().min(0).required(),
		});
		try {
			req.body = await schema.validateAsync(req.body, options);
			next();
		} catch (error) {
			return respone.errorJoiValidation(res, error);
		}
	}
};