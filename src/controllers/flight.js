const {Flight, Airplane, Airport, Airline} = require("../db/models");
const convert = require("../utils/convert");

module.exports = {
	search: async (req, res, next) => {
		try {
			const {d: departure_airport_city, a: arrival_airport_city, date} = req.query;
			if(!departure_airport_city || !arrival_airport_city || !date) {
				return res.status(400).json({
					status: false,
					message: "missing query parameter",
					data: null
				});
			}

			const departureAirport = await Airport.findOne({
				where: {city: convert.capitalFirstLetter(departure_airport_city)},
				attributes: ["id"]
			});
			if(!departureAirport) {
				return res.status(400).json({
					status: false,
					message: "departure airport not found",
					data: null
				});
			}

			const arrivalAirport = await Airport.findOne({
				where: {city: convert.capitalFirstLetter(arrival_airport_city)},
				attributes: ["id"]
			});
			if(!arrivalAirport) {
				return res.status(400).json({
					status: false,
					message: "departure airport not found",
					data: null
				});
			}

			const flights = await Flight.findAndCountAll({
				where: {
					departure_airport_id: departureAirport.id,
					arrival_airport_id: arrivalAirport.id,
					date: date
				},
				include: [
					{
						model: Airplane,
						as: "airplane",
						attributes: {
							exclude: ["createdAt", "updatedAt"]
						},
						include: {
							model: Airline,
							as: "airline",
							attributes: {
								exclude: ["id", "createdAt", "updatedAt"]
							}
						},
						required: true,
					},
					{
						model: Airport,
						as: "departure_airport",
						attributes: {
							exclude: ["createdAt", "updatedAt"]
						},
						required: true,
					},
					{
						model: Airport,
						as: "arrival_airport",
						attributes: {
							exclude: ["createdAt", "updatedAt"]
						},
						required: true,
					},
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				},
				order: [
					["departure_time", "ASC"]
				]
			});

			const result = flights.rows.map(flight => {
				const departure_time = convert.timeWithTimeZone(flight.departure_time);
				const arrival_time = convert.timeWithTimeZone(flight.arrival_time);
				const duration = convert.DurationToString(flight.duration);
				const price = convert.NumberToCurrency(flight.price);

				return {
					id: flight.id,
					flight_number: flight.flight_number,
					price,
					airplane_model: flight.airplane.model,
					capacity: flight.airplane.capacity,
					airline:{
						name: flight.airplane.airline.name,
						iata: flight.airplane.airline.airline_iata,
						logo: flight.airplane.airline.logo
					},
					departure_airport: {
						name: flight.departure_airport.name,
						city: flight.departure_airport.city,
						country: flight.departure_airport.country,
						iata: flight.departure_airport.airport_iata,
					}, 
					arrival_airport: {
						name: flight.arrival_airport.name,
						city: flight.arrival_airport.city,
						country: flight.arrival_airport.country,
						iata: flight.arrival_airport.airport_iata,
					},
					date: flight.date,
					departure_time,
					arrival_time,
					duration,
				};
			});

			return res.status(200).json({
				status: true,
				message: "success search flight",
				data: {
					item_count: flights.count,
					flights: result
				}
			});
		} catch (error) {
			next(error);
		}
	},

	getAll: async (req, res, next) => {
		try {
			const flights = await Flight.findAll({flight: [["id", "ASC"]] });

			return res.status(200).json({
				status: true,
				message: "success get all flight",
				data: flights
			});
		} catch (error) {
			next(error);
		}
	},

	create: async (req, res, next) => {
		try {
			const {airplane_id, from_airport_id, to_airport_id, date, departure_time, arrival_time, estimation} = req.body;

			if(!airplane_id || !from_airport_id || !to_airport_id || !date || !departure_time || !arrival_time || !estimation){
				throw new Error("mising body request");
			}

			const checkAirplane = await Airplane.findAndCountAll({ where: { id: airplane_id } });

			if (checkAirplane.count != airplane_id.length) {
				throw new Error("there's airplane_id not found");
			}

			const checkFromAirport = await Airport.findAndCountAll({ where: { id: from_airport_id} });

			if (checkFromAirport.count != from_airport_id.length) {
				throw new Error("there's from_airport_id not found");
			}

			const checkToAirport = await Airport.findAndCountAll({ where: { id: to_airport_id} });

			if (checkToAirport.count != to_airport_id.length) {
				throw new Error("there's to_airport_id not found");
			}

			if (to_airport_id == from_airport_id){
				throw new Error("airports are not the same");
			}

			const newFlight = await Flight.create({ airplane_id, from_airport_id, to_airport_id, date, departure_time, arrival_time, estimation });

			return res.status(201).json({
				status: true,
				message: "success create new flight",
				data: newFlight,
			});
		} catch (err) {
			if (err.message == "missing body request" || err.message == "there's airplane_id not found" || err.message == "there's from_airport_id not found"  || err.message == "there's to_airport_id not found" || err.message == "airports are not the same") {
				return res.status(400).json({
					status: false,
					message: err.message,
					data: null,
				});
			}
			next(err);
		}
	},

	detail: async(req, res, next) => {
		try {
			const { flight_id } = req.params;
		
			if (!flight_id) {
				throw new Error("missing paramater");
			}
		
			const flight = await Flight.findOne({ where: { id: flight_id } });
			if (!flight) {
				throw new Error("flight not found");
			}

			const airplaneFlight = await Flight.findByPk(flight_id, {
				include: {
					model: Airplane,
					as: "airplane",
					throught: {
						attributes: [],
					},
				},
				order: [[{model: Airplane, as: "airplane"}, "id", "ASC"]]
			});
			
			return res.status(200).json({
				status: true,
				message: "success get detail flight",
				data: airplaneFlight
			});
	
		} catch (err) {
			next(err);
		}
	}

};