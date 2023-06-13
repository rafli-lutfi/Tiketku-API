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
			if(!name || !city || !country || !airport_iata){
				return res.status(400).json({
					status: false,
					message: "missing body request",
					data: null
				});
			}
			const checkAirport = await Airport.findOne({where: {airport_iata}});
			if (checkAirport){
				return res.status(400).json({
					status: false, 
					message: "airport already exist",
					data: null
				});
			}
            
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






