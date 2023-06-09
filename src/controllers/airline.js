const {Airline, Airplane} = require("../db/models");

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const airlines = await Airline.findAll({
				order: [["id", "ASC"]], 
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				},
			});

			return res.status(200).json({
				status: true,
				message: "success get all airlines",
				data: airlines
			});
		} catch (error) {
			next(error);
		}
	},

	getDetail: async (req, res, next) => {
		try {
			const {id} = req.params;
			if (!id) {
				return res.status(400).json({
					status: false,
					message: "missing id parameter",
					data: null
				});
			}

			const airline = await Airline.findOne({
				where: {id}, 
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				},
				include: {
					model: Airplane,
					as: "airplanes",
					attributes: {
						exclude: ["airline_id", "createdAt", "updatedAt"]
					}
				},
				required: true
			});

			if (!airline) {
				return res.status(400).json({
					status: false,
					message: "airline not found",
					data: null
				});
			}

			return res.status(200).json({
				status: true,
				message: "success get detail airline",
				data: airline
			});
		} catch (error) {
			next(error);
		}
	},


};