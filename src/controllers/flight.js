const {Flight, Airplane, Airport, Airline, AirplaneSeatClass, Price, Order} = require("../db/models");
const {Op} = require("sequelize");
const convert = require("../utils/convert");
const moment = require("moment-timezone");
const {TZ = "Asia/Jakarta"} = process.env; 

module.exports = {
	search: async (req, res, next) => {
		try {
			let {sort_by, sort_type, page, per_page} = req.query;

			const offset = (page - 1) * per_page;

			const {departure_airport_city, arrival_airport_city, date, seat_class, adult, child, infant} = req.body;

			const totalPassengers = adult + child + infant;

			// to sorting data flight purposes
			let sort = [];
			if(sort_by == "price"){
				sort = ["prices", sort_by, sort_type];
			}else{
				sort = [sort_by, sort_type];
			}

			const departureAirport = await Airport.findOne({
				where: {city: convert.capitalFirstLetter(departure_airport_city)},
				attributes: ["id"]
			});

			const arrivalAirport = await Airport.findOne({
				where: {city: convert.capitalFirstLetter(arrival_airport_city)},
				attributes: ["id"]
			});

			const time_now = convert.dateToDatabaseFormat(new Date());

			const flights = await Flight.findAll({
				where: {
					departure_airport_id: departureAirport.id,
					arrival_airport_id: arrivalAirport.id,
					date: date,
					departure_time: {
						[Op.gt]: time_now
					}
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
				order: [sort],
				limit: per_page,
				offset: offset,
			});

			const result = await Promise.all( flights.map( async flight => {
				const orders = await Order.findAll({
					where: {flight_id: flight.id, seat_type: seat_class}
				});

				// compare total seat left with total passenger in order 
				const seatLeft = flight.airplane.seat_classes[0].total_seat - orders.length;
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

	detail: async(req, res, next) => {
		try {
			const { flight_id, seat_class, adult, child, infant } = req.body;

			const price = await Price.findOne({
				where: {flight_id, seat_type: seat_class},
				include: {
					model: Flight, 
					as: "flight_price",
					include: [
						{
							model: Airplane,
							as: "airplane",
							include: {
								model: Airline,
								as: "airline",
								attributes: {
									exclude: ["id", "createdAt", "updatedAt"]
								},
								required: true,
							},
							attributes: {
								exclude: ["createdAt", "updatedAt"]
							},
							required: true	
						},
						{
							model: Airport,
							as: "departure_airport",
							attributes: {
								exclude: ["createdAt", "updatedAt"]
							},
							required: true
						},
						{
							model: Airport,
							as: "arrival_airport",
							attributes: {
								exclude: ["createdAt", "updatedAt"]
							},
							required: true
						},
					],
					attributes: {
						exclude: ["createdAt", "updatedAt"]
					},
					required: true
				},
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				}
			});

			if(!price){
				return res.status(400).json({
					status: false,
					message: "price not found", 
					data: null
				});
			}

			const result = {
				info: {
					airline_name: price.flight_price.airplane.airline.name,
					seat_class: seat_class,
					airplane_model: price.flight_price.airplane.model,
					logo: price.flight_price.airplane.airline.logo,
					free_baggage: price.flight_price.free_baggage,
					cabin_baggage: price.flight_price.cabin_baggage,
				},
				departure: {
					departure_time: convert.timeWithTimeZone(price.flight_price.departure_time),
					date: moment(price.flight_price.date).tz(TZ).format("DD MMMM YYYY"),
					airport_name: price.flight_price.departure_airport.name,
					iata: price.flight_price.departure_airport.airport_iata,
				}, 
				arrival: {
					arrival_time: convert.timeWithTimeZone(price.flight_price.arrival_time),
					date: moment(price.flight_price.date).tz(TZ).format("DD MMMM YYYY"),
					airport_name: price.flight_price.arrival_airport.name,
					iata: price.flight_price.arrival_airport.airport_iata,
				},
				price: {
					adult_count: adult,
					adult_price: convert.NumberToCurrency(price.price * adult),
					child_count: child,
					child_price: child == 0 ? null : convert.NumberToCurrency(price.price * child),
					infant_count: infant,
					infant_price: child == 0 ? null : 0,
					total_price: convert.NumberToCurrency(price.price * (adult + child)),
					tax: convert.NumberToCurrency(Math.round(price.price * 10/100))
				}
			};

			return res.status(200).json({
				status: true,
				message: "success get detail flight",
				data: result
			});
	
		} catch (err) {
			next(err);
		}
	}

};