const {Flight, Airplane, Airport, Airline, AirplaneSeatClass, Price, Order} = require("../db/models");
const convert = require("../utils/convert");

module.exports = {
	search: async (req, res, next) => {
		try {
			const {sort_by = "departure_time", sort_type = "ASC"} = req.query;

			const {departure_airport_city, arrival_airport_city, date, seat_class, adult, child = 0, infant = 0} = req.body;
			if(!departure_airport_city || !arrival_airport_city || !date || !seat_class) {
				return res.status(400).json({
					status: false,
					message: "missing query parameter",
					data: null
				});
			}

			// to sorting data flight purposes
			let sort = [];
			if(sort_by == "price"){
				sort = ["prices", sort_by, sort_type];
			}else{
				sort =[sort_by, sort_type];
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

			const seatClass = await AirplaneSeatClass.findOne({
				where: {seat_type: seat_class.toUpperCase()},
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				},
			});

			if (!seatClass) {
				return res.status(400).json({
					status: false,
					message: "seat class not found",
					data: null
				});			
			}

			// check total seat left
			const totalPassengers = adult + child + infant;

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
						include: [
							{
								model: Airline,
								as: "airline",
								attributes: {
									exclude: ["id", "createdAt", "updatedAt"]
								},
								required: true,
							},
							{
								model: AirplaneSeatClass,
								as: "seat_classes",
								where: {seat_type: seat_class.toUpperCase()},
								attributes: {
									exclude: ["id", "createdAt", "updatedAt"]
								},
								required: true,
							},
						],
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
					{
						model: Price,
						as: "prices",
						where: {seat_type: seat_class},
						attributes: ["price"],
						required: true,
					}
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				},
				order: [sort]
			});

			const result = await Promise.all( flights.rows.map( async flight => {
				const orders = await Order.findAndCountAll({
					where: {flight_id: flight.id, seat_type: seat_class}
				});

				// compare total seat left with total passenger in order 
				const seatLeft = flight.airplane.seat_classes[0].total_seat - orders.count;
				if (seatLeft <= totalPassengers){
					return;
				}

				const departure_time = convert.timeWithTimeZone(flight.departure_time);
				const arrival_time = convert.timeWithTimeZone(flight.arrival_time);
				const duration = convert.DurationToString(flight.duration);
				const price = convert.NumberToCurrency(flight.prices[0].price);

				return {
					id: flight.id,
					flight_number: flight.flight_number,
					airplane_model: flight.airplane.model,
					info: {
						price,
						seat_class: flight.airplane.seat_classes[0].seat_type,
						total_seat: flight.airplane.seat_classes[0].total_seat,
						free_baggage: flight.free_baggage,
						cabin_baggage: flight.cabin_baggage,
					},
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
			}));

			// remove null value from array
			const filter = result.filter(Boolean);

			return res.status(200).json({
				status: true,
				message: "success search flight",
				data: {
					item_count: filter.length,
					passengers: {
						adult,
						child,
						infant
					},
					flights: filter,
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