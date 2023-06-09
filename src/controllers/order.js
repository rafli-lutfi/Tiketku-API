const {Order} = require("../db/models");

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
			const {user_id: userId} = req.user;
			const {
				flight_id: flightId, 
				price_id: priceId, 
				payment_id: paymentId, 
				total_passengers:totalPassengers
			} = req.body;

			if (!userId) return res.status(400).json({
				status: false,
				message: "missing user_id",
				data: null
			});

			if (!flightId, !priceId, !paymentId, !totalPassengers) return res.status(400).json({
				status: false,
				message: "missing body request",
				data: null
			});


		} catch (error) {
			next(error);
		}
	}
};