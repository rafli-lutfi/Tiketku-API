const {Airplane} =require("../db/models");

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const airplanes = await Airplane.findAll();

			return res.status(200).json({
				status: true,
				message: "success",
				data: airplanes
			});
		} catch (error) {
			next(error);
		}
	},

	create: async (req, res, next) => {
		try {
			const { airline_id, model, capacity } = req.body;

			const airplane = await Airplane.create({ airline_id, model, capacity });
    
			return res.status(201).json({
				status: true,
				message: "Airplane created ",
				data: airplane
			});
		} catch (error) {
			next(error);
		}
	},
};






