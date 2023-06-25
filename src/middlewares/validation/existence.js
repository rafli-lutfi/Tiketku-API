const Joi = require("joi");
const {User, Flight, Airport, Order} = require("../../db/models");
const convert = require("../../utils/convert");

const customErrorJoi = (message, field) => {
	throw new Joi.ValidationError(
		message,
		[
			{
				message: message,
				path: [field],
				type: `string.${field}`,
				context: {
					key: field,
					label: field,
				},
			}
		],
	);
};

module.exports = {
	isEmailExist: async (email) => {
		const user = await User.findOne({
			where: {email: email},
			attributes: ["id"]
		});

		if (user) {
			customErrorJoi("email already used!", "email");
		} 
	},

	isEmailVerified: async (email) => {
		const user = await User.findOne({
			where: {email: email},
			attributes: ["email"]
		});

		if(!user){
			customErrorJoi("you're not register yet", "email");
		}

		if(user.email_verified == true){
			customErrorJoi("your account already verified", "email");
		}

	},

	isFlightExist: async (flight_id) => {
		const flight = await Flight.findOne({ where: { id: flight_id } });

		if (!flight) {
			customErrorJoi("flight not found", "flight");
		}
	},

	isDepartureAirportExist: async (departure_airport_city) => {
		const departureAirport = await Airport.findOne({
			where: {city: convert.capitalFirstLetter(departure_airport_city)},
			attributes: ["id"]
		});

		if(!departureAirport){
			customErrorJoi("departure airport not found", "departure_airport");
		}
	},

	isArrivalAirportExist: async (arrival_airport_city) => {
		const arrivalAirport = await Airport.findOne({
			where: {city: convert.capitalFirstLetter(arrival_airport_city)},
			attributes: ["id"]
		});

		if(!arrivalAirport) {
			customErrorJoi("arrival airport not found", "arrival_airport");
		}
	},

	isOrderExist: async (order_id) => {
		const order = await Order.findOne({
			where: {id: order_id},
			attributes: ["id"]
		});
		if(!order){
			customErrorJoi("order not found", "order");
		}
	}
};