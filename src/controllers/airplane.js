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

		
			if(!airline_id || !model || !capacity){
				return res.status(400).json({
					status: false,
					message: "missing body request",
					data: null
				});
			}
			const checkPlane = await Airplane.findOne({where: {airline_id}});
			if (checkPlane){
				return res.status(400).json({
					status: false, 
					message: "airplane already exist",
					data: null
				});
			}
			const newPlane = await Airplane.create({ airline_id, model, capacity });

			
    
			return res.status(201).json({
				status: true,
				message: "Airplane created ",
				data: newPlane
			});
		} catch (error) {
			next(error);
		}
	},
};






