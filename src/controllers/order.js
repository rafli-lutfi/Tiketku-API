const {Order, Flight} = require("../db/models");
const moment = require("moment-timezone");
const crypto = require("crypto");

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
				infant = 0
			} = req.query;

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

			const flight = await Flight.findByPk(flight_id, {
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				}
			});

			if(!flight){
				return res.status(400).json({
					status: false,
					message: "flight not found",
					data: null
				});
			}

			const booking_code = crypto.randomBytes(4).toString("hex").toUpperCase();

			const total_price = flight.price * totalPassengers;
			const tax = total_price * 110/100;

			const newOrder = await Order.create({
				user_id: id,
				flight_id,
				booking_code,
				total_passengers: totalPassengers,
				total_price,
				tax,
				status: "UNPAID",
				paid_before: moment().tz("Asia/Jakarta").add(15, "minutes").format("HH:mm:ss"),
			});

			return res.status(201).json({
				status: true,
				message: "success create new order",
				data: newOrder
			});
		} catch (error) {
			next(error);
		}
	}
};