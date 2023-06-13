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
			if(!flight_id || !seat_type || !price || !discount){
				return res.status(400).json({
					status: false,
					message: "missing body request",
					data: null
				});
			}

			
			const checkPrice = await Price.findOne({where: {flight_id}});
			if (checkPrice){
				return res.status(400).json({
					status: false, 
					message: "price already exist",
					data: null
				});
			}
            
			const newPrice = await Price.create({ flight_id, seat_type, price, discount});

			return res.status(201).json({
				status: true,
				message: "Price created ",
				data: {
					flight_id: newPrice.flight_id, 
					seat_type: newPrice.seat_type, 
					price: newPrice.price, 
					discount: newPrice.discount 
				}
			});
		} catch (error) {
			next(error);
		}
	},
};
