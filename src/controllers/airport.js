const {Airport, Flight, Order, sequelize} =require("../db/models");
const convert = require("../utils/convert");

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

	create: async (req, res, next) => {
		try {
			const { name, city, country, airport_iata } = req.body;
			if(!name || !city || !country || !airport_iata){
				return res.status(400).json({
					status: false,
					message: "missing body request",
					data: null
				});
			}
			const checkAirport = await Airport.findOne({where: {airport_iata}});
			if (checkAirport){
				return res.status(400).json({
					status: false, 
					message: "airport already exist",
					data: null
				});
			}
            
			const airport = await Airport.create({ name, city, country, airport_iata });
    
			return res.status(201).json({
				status: true,
				message: "Airport created ",
				data: airport
			});
		} catch (error) {
			next(error);
		}
	},

	getByCity: async (req, res, next ) => {
		try {
			const { city } = req.body;
			if (!city) {
				return res.status(400).json({
					status: false,
					message: "missing city parameter",
					data: null
				});
			}
		
			const byCity = await Airport.findOne({
				where: { city: convert.capitalFirstLetter(city) },
				attributes: { exclude: ["createdAt", "updatedAt"] }
			});
  
			if (!byCity) {
				return res.status(400).json({
					status: false,
					message: "Airport not found",
					data: null
				});
			}
 
			return res.status(200).json({
				status: true,
				message: "Success",
				data: byCity
			});
			
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

			return res.status(200).json({
				status: true,
				message: "success get favorite destination",
				data: destinations.map(flight => flight.arrival_airport)
			});
		} catch (error) {
			next(error);
		}
	}
};