const {Price} =require("../db/models");

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const prices = await Price.findAll();

			return res.status(200).json({
				status: true,
				message: "success",
				data: prices
			});
		} catch (error) {
			next(error);
		}
	},

	create: async (req, res, next) => {
		try {
			const { flight_id, seat_type, price, discount } = req.body;

			const harga = await Price.create({ flight_id, seat_type, price, discount });
    
			return res.status(201).json({
				status: true,
				message: "Price created ",
				data: harga
			});
		} catch (error) {
			next(error);
		}
	},
};
