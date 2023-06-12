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

	create: async (req, res, next) => {
		try {
			const {name, airline_iata, logo} = req.body;
			if(!name || !airline_iata || !logo){
				return res.status(400).json({
					status: false,
					message: "missing body request",
					data: null
				});
			}

			const checkAirline = await Airline.findOne({where: {airline_iata}});
			if (checkAirline){
				return res.status(400).json({
					status: false, 
					message: "airline already exist",
					data: null
				});
			}

			const newAirline = await Airline.create({name, airline_iata, logo});
            
			return res.status(201).json({
				status: true,
				message: "success create new airline",
				data: {
					id: newAirline.id,
					name: newAirline.name,
					airline_iata: newAirline.airline_iata,
					logo: newAirline.logo
				}
			});
		} catch (error) {
			next(error);
		}
	},

	update: async (req, res, next) => {
		try {
			const {id} = req.params;
			const {name, airline_iata, logo} = req.body;
			if(!name && !airline_iata && !logo){
				return res.status(400).json({
					status: false,
					message: "missing body request",
					data: null
				});
			}

			const checkAirline = await Airline.findOne({where: {id}});
			if (!checkAirline){
				return res.status(400).json({
					status: false, 
					message: "airline not found",
					data: null
				});
			}

			if(checkAirline.name == name || checkAirline.airline_iata == airline_iata || checkAirline.logo == logo){
				return res.status(400).json({
					status: false,
					message: "some data still same with previous",
					data: null
				});
			}

			await Airline.update({name, airline_iata, logo},{where: {id}});

			return res.status(200).json({
				status: true,
				message: "success update airline",
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},

	delete: async (req, res, next) => {
		try {
			const {id} = req.params;
            
			const checkAirline = await Airline.findOne({where: {id}});
			if (!checkAirline){
				return res.status(400).json({
					status: false, 
					message: "airline not found",
					data: null
				});
			}

			await Airline.destroy({where: {id}});

			return res.status(200).json({
				status: true,
				message: "success delete airline",
				data: null
			});
		} catch (error) {
			next(error);
		}
	},
};