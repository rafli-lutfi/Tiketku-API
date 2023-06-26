const {Order, Flight, Price, Airport, Airplane, Airline, Passenger, Payment, sequelize} = require("../db/models");
const moment = require("moment-timezone");
const crypto = require("crypto");
const notif = require("../utils/notifications");
const convert = require("../utils/convert");

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const {id} = req.user;

			const orders = await Order.findAll({
				where: {user_id: id},
				include: {
					model: Flight,
					as: "flight",
					include: [
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
						exclude: ["createdAt", "upadatedAt"]
					},
					required: true
				},
				attributes: {
					exclude: ["createdAt", "upadatedAt"]
				},
				order: [["flight", "date", "DESC"]],
			});

			const result = orders.map(order => {
				let status = order.status;
				if (order.status == "UNPAID" && convert.databaseToDateFormat(moment()) > convert.databaseToDateFormat(order.paid_before)){
					Order.update({status: "CANCELED"}, {where: {id: order.id}}).catch(error => next(error));
					status = "CANCELED";
				}
				return {
					id: order.id,
					date: order.flight.date,
					status: status,
					booking_code: order.code,
					seat_class: order.seat_type,
					paid_before: convert.databaseToDateFormat(order.paid_before),
					price: convert.NumberToCurrency(order.total_price + order.tax),
					flight_detail: {
						departure_city: order.flight.departure_airport.city,
						arrival_city: order.flight.arrival_airport.city,
						departure_time: convert.databaseToDateFormat(order.flight.departure_time),
						arrival_time: convert.databaseToDateFormat(order.flight.arrival_time),
						duration: convert.DurationToString(order.flight.duration),
					},
				};
			});

			return res.status(200).json({
				status: true,
				message: "success get all order",
				data: result
			});
		} catch (error) {
			next(error);
		}
	},

	getDetail: async (req, res, next) => {
		try {
			const {id} = req.user;
			const {order_id} = req.params;
			
			const order = await Order.findOne({
				where: {id: order_id, user_id: id},
				include: [
					{
						model: Flight,
						as: "flight",
						include: [
							{
								model: Airplane,
								as: "airplane",
								include: {
									model: Airline,
									as: "airline",
									attributes: {
										exclude: ["createdAt", "updatedAt"]
									},
									required: true,	
								},
								attributes: {
									exclude: ["createdAt", "updatedAt"]
								},
								required: true,
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
						required: true
					},
					{
						model: Passenger,
						as: "passengers",
						where: {order_id},
						attributes: {
							exclude: ["createdAt", "updatedAt"]
						},
						required: true,
					}
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				},
			});

			if(!order){
				return res.status(403).json({
					status: false,
					message: "order not found, please input the correct id",
					data: null
				});
			}

			let paymentType;
			if(order.status == "PAID"){
				const payment = await Payment.findOne({
					where: {order_id: order.id},
					attributes: {
						exclude: ["createdAt", "updatedAt"]
					}
				});

				paymentType = payment.type;
			}

			const price = await Price.findOne({
				where: {flight_id: order.flight.id, seat_type: order.seat_type},
			});

			let adult = 0, child = 0, infant = 0;

			const passengers = order.passengers.map(passenger => {
				if (passenger.age_group == "adult") adult++;
				if (passenger.age_group == "child") child++;
				if (passenger.age_group == "infant") infant++;
				return {
					title: passenger.title,
					fullname: passenger.fullname,
					id: passenger.ktp
				};
			});

			const paid_before = convert.databaseToDateFormat(order.paid_before);

			const result = {
				booking_code: order.booking_code,
				status: order.status,
				payment_type: paymentType ? paymentType : null,
				paid_before: moment().isAfter(paid_before) || order.status != "UNPAID" ? null : paid_before,
				flight_detail:{
					departure:{
						airport_name: order.flight.departure_airport.name,
						city: order.flight.departure_airport.city,
						date: order.flight.date,
						time: convert.timeWithTimeZone(order.flight.departure_time),
					},
					arrival:{
						airport_name: order.flight.arrival_airport.name,
						city: order.flight.arrival_airport.city,
						date: order.flight.date,
						time: convert.timeWithTimeZone(order.flight.arrival_time),
					},
					airplane: {
						airline: order.flight.airplane.airline.name,
						seat_class: order.seat_type,
						flight_number: order.flight.flight_number,
						logo: order.flight.airplane.airline.logo,
						baggage: order.flight.free_baggage,
						cabin_baggage: order.flight.cabin_baggage
					},
					passengers
				},
				price_detail: {
					adult_count: adult,
					child_count: child == 0 ? null: child,
					infant_count: infant == 0 ? null: infant,
					adult_price: convert.NumberToCurrency(adult * price.price),
					child_price: child == 0 ? null : convert.NumberToCurrency(child * price.price),
					infant_price: infant == 0 ? null : convert.NumberToCurrency(child * price.price),
					tax: convert.NumberToCurrency(order.tax),
					total_price: convert.NumberToCurrency(order.total_price + order.tax)
				}
			};

			return res.status(200).json({
				status: true,
				message: "success get detail order",
				data: result
			});
		} catch (error) {
			next(error);
		}
	},

	create: async (req, res, next) => {
		try {
			const {id} = req.user;
			const {
				flight_id, 
				adult,
				child,
				infant,
				passengers,
				seat_class
			} = req.body;

			if (!id) return res.status(400).json({
				status: false,
				message: "missing user_id",
				data: null
			});

			const totalPassengers = adult + child + infant;

			if (passengers.length != totalPassengers) return res.status(400).json({
				status: false,
				message: `mismatched, total passenger is ${totalPassengers} but total passenger data is ${passengers.length}`,
				data: null
			});

			const result = await sequelize.transaction(async (t) => {
				const flight = await Flight.findByPk(flight_id, {
					attributes: {
						exclude: ["createdAt", "updatedAt"]
					},
					include: [
						{
							model: Price,
							as: "prices",
							where: {seat_type: seat_class},
							attributes: {
								exclude: ["createdAt", "updatedAt"],
							},
							required: true,
						}
					]
				}, {transaction: t});

				const booking_code = crypto.randomBytes(4).toString("hex").toUpperCase();

				const total_price = flight.prices[0].price * (totalPassengers - infant);
				const tax = Math.round(total_price * 10/100);

				const newOrder = await Order.create({
					user_id: id,
					flight_id,
					booking_code,
					seat_type: seat_class,
					total_passengers: totalPassengers,
					total_price,
					tax,
					status: "UNPAID",
					paid_before: convert.dateToDatabaseFormat(moment().add(15, "minutes")),
					createdAt: convert.dateToDatabaseFormat(new Date()),
					updatedAt: convert.dateToDatabaseFormat(new Date()),
				}, {transaction: t});

				await Promise.all(
					passengers.map(async (passenger) => {
						try {
							await Passenger.create({
								order_id: newOrder.id,
								...passenger,
								createdAt: convert.dateToDatabaseFormat(moment()),
								updatedAt: convert.dateToDatabaseFormat(moment()),
							}, {transaction: t});
						} catch (error) {
							console.error("error while creating passenger data:", error.message);
							throw error;
						}
					})
				);

				return {
					id: newOrder.id,
					flight_id: newOrder.flight_id,
					booking_code: newOrder.booking_code,
					seat_class: newOrder.seat_type,
					total_passengers: newOrder.total_passengers,
					total_price: convert.NumberToCurrency(newOrder.total_price),
					tax: convert.NumberToCurrency(newOrder.tax),
					status: newOrder.status,
					paid_before: newOrder.paid_before,
				};
			});

			const notifData = [{
				title: "New Order",
				description: `there is new order in your account, total price ${result.total_price}`,
				user_id: id
			}];

			notif.sendNotif(notifData);

			return res.status(201).json({
				status: true,
				message: "success create new order",
				data: result
			});
		} catch (error) {
			next(error);
		}
	}
};