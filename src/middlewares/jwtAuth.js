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

			jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
				if(err){
					const message = err.message == "jwt expired" ? "token already expired, please login again" : err.message;
					return res.status(401).json({
						status: false, 
						message: message,
						data: null
					});
				}

				req.user = {
					id : decoded.id,
					fullname: decoded.fullname,
					email: decoded.email,
					role: decoded.role
				};

				next();
			});
		} catch (error) {
			next(error);
		}
	}
};