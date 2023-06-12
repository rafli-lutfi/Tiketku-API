const {Airport} =require("../db/models");

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const airports = await Airport.findAll();

			return res.status(200).json({
				status: true,
				message: "success",
				data: airports
			});
		} catch (error) {
			next(error);
		}
	},

	create: async (req, res, next) => {
		try {
			const { name, city, country, airport_iata } = req.body;
            
			const airport = await Airport.create({ name, city, country, airport_iata });
    
			return res.status(201).json({
				status: true,
				message: "Airport created ",
				data: airport
			});
		} catch (error) {
			next(error);
		}
	},
};






