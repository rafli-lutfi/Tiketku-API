const {Airport, Flight, Order, sequelize} =require("../db/models");
const convert = require("../utils/convert");
const respone = require("../utils/respone");

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const airports = await Airport.findAll({
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				}
			});

			return res.status(200).json({
				status: true,
				message: "success",
				data: airports
			});
		} catch (error) {
			next(error);
		}
	},

	search: async (req, res, next ) => {
		try {
			const { city } = req.body;

			const byCity = await Airport.findOne({
				where: { city: convert.capitalFirstLetter(city) },
				attributes: { exclude: ["createdAt", "updatedAt"] }
			});

			if (!byCity) return respone.errorBadRequest(
				res, 
				"airports not found", 
				`airports with city name ${city} not found`
			);

			return respone.successOK(res, "success", byCity)
			;
		} catch (error) { 
			next(error);
			
		}
	},

	favoriteDestination: async (req, res, next) => {
		try {
			// look for the 5 highest number of orders by flight id.
			const orders = await Order.findAll({
				where: {status: "PAID"},
				attributes: [
					[sequelize.fn("COUNT", sequelize.col("flight_id")), "jumlah_flight"],
					"flight_id"
				],
				group: ["flight_id", "id"],
				order: [["jumlah_flight", "DESC"], ["flight_id", "ASC"]] ,
				limit: 5
			});

			const flight_ids = [];

			orders.forEach(order => {
				flight_ids.push(order.flight_id);
			});

			// look for the arrival airport(equal to destination) through the flight table.
			const destinations = await Flight.findAll({
				where: {id: flight_ids},
				include: {
					model: Airport,
					as: "arrival_airport",
					attributes: {
						exclude: ["createdAt", "updatedAt"]
					} 
				},
				attributes: []
			});

			const data = destinations.map(flight => flight.arrival_airport);

			return respone.successOK(res, "success get favorite destination", data);

		} catch (error) {
			next(error);
		}
	}
};