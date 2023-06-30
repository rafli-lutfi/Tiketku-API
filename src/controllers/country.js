const respone = require("../utils/respone");
const Country = require("../db/seeders/data/country.json");
module.exports = {
	index : async (req, res, next) => {
		try {

			const data = Country.map(country => `${country.name} (${country.code})`);

			return respone.successOK(res, "success", data);

		} catch (error){
			next(error);
		}
	}

};