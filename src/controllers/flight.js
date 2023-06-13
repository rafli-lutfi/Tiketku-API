const {Flight, Airplane, Airport} = require("../db/models");

module.exports = {
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