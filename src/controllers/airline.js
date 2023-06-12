const {Airline} =require("../db/models");

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const airlines = await Airline.findAll();

			return res.status(200).json({
				status: true,
				message: "success",
				data: airlines
			});
		} catch (error) {
			next(error);
		}
	},

	create: async (req, res, next) => {
		try {
			const { name, airline_iata, logo } = req.body;
            
			const airline = await Airline.create({ name, airline_iata, logo });
    
			return res.status(201).json({
				status: true,
				message: "airline created ",
				data: airline
			});
		} catch (error) {
			next(error);
		}
	},
};






