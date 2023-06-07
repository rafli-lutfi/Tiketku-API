const jwt = require("jsonwebtoken");
const {JWT_SECRET_KEY} = process.env;
module.exports = {
	authenticate: async (req, res, next) => {
		try {
			const token = req.headers["authorization"];
			if(!token){
				return res.status(401).json({
					status: false,
					message: "unauthorized user, please login first",
					data: null
				});
			}

			const data = jwt.verify(token, JWT_SECRET_KEY);

			req.user = {
				id : data.id,
				fullname: data.fullname,
				email: data.email,
			};

			next();
		} catch (error) {
			next(error);
		}
	}
};