const {Order, Flight, Price, Passenger, sequelize} = require("../db/models");
const moment = require("moment-timezone");
const crypto = require("crypto");
const convert = require("../utils/convert");

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const orders = await Order.findAll({order: [["id", "ASC"]] });

			return res.status(200).json({
				status: true,
				message: "success get all order",
				data: orders
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
				child = 0,
				infant = 0,
				passengers,
				seat_class
			} = req.body;

			if (!id) return res.status(400).json({
				status: false,
				message: "missing user_id",
				data: null
			});

			const totalPassengers = adult + child + infant;

			if (!flight_id || totalPassengers == 0) return res.status(400).json({
				status: false,
				message: "missing query paramater",
				data: null
			});

			if (passengers.length != totalPassengers - infant) return res.status(400).json({
				status: false,
				message: "the number of passenger data filled in isn't the same as the specified number of passengers.",
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

				if(!flight){
					return res.status(400).json({
						status: false,
						message: "flight not found",
						data: null
					});
				}

				const booking_code = crypto.randomBytes(4).toString("hex").toUpperCase();

				const total_price = flight.prices[0].price * totalPassengers;
				const tax = Math.round(total_price * 10/100);

				const newOrder = await Order.create({
					user_id: id,
					flight_id,
					booking_code,
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
					flight_id: newOrder.flight_id,
					booking_code: newOrder.booking_code,
					total_passengers: newOrder.total_passengers,
					total_price: convert.NumberToCurrency(newOrder.total_price),
					tax: convert.NumberToCurrency(newOrder.tax),
					status: newOrder.status,
					paid_before: newOrder.paid_before,
					createdAt: newOrder.createdAt,
					updatedAt: newOrder.updatedAt,
				};
			});

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