const {Airport, sequelize} = require("../db/models");
const convert = require("../utils/convert");
const respone = require("../utils/respone");

module.exports = {
	getAll: async (req, res, next) => {
		try {
			const airports = await Airport.findAll({
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				}
			});

			return res.status(200).json({
				status: true,
				message: "success",
				data: airports
			});
		} catch (error) {
			next(error);
		}
	},

	search: async (req, res, next ) => {
		try {
			const { city } = req.body;

			const byCity = await Airport.findOne({
				where: { city: convert.capitalFirstLetter(city) },
				attributes: { exclude: ["createdAt", "updatedAt"] }
			});

			if (!byCity) return respone.errorBadRequest(
				res, 
				"airports not found", 
				`airports with city name ${city} not found`
			);

			return respone.successOK(res, "success", byCity)
			;
		} catch (error) { 
			next(error);
			
		}
	},

	favoriteDestination: async (req, res, next) => {
		try {
			// look for the 5 highest number of orders and find where is the destination
			const result = await sequelize.query(
				`SELECT distinct  
				"arrival_airport"."id" as "id", 
				"arrival_airport"."city" AS "city",
				"arrival_airport"."name" AS "name",
				"arrival_airport"."country" AS "country",
				"arrival_airport"."airport_iata" as "airport_iata",
				COUNT ("flight_id") AS "jumlah_flight"
				FROM "Orders" AS "Order"
				INNER JOIN "Flights" AS "flight"
				ON "Order"."flight_id" = "flight"."id"
					inner join "Airports" as "arrival_airport"
					on "flight"."arrival_airport_id" = "arrival_airport"."id"
				WHERE "Order"."status" = 'PAID' 
					GROUP BY 
						"arrival_airport"."id",
						"arrival_airport"."city",
						"arrival_airport"."name",
						"arrival_airport"."country",
						"arrival_airport"."airport_iata"
					ORDER BY "jumlah_flight" desc
					LIMIT 5;`
			);

			return respone.successOK(res, "success get favorite destination", result[0]);

		} catch (error) {
			next(error);
		}
	}
};