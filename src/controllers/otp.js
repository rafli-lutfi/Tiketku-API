const jwt = require("jsonwebtoken");
const {User} = require("../db/models");
const {JWT_SECRET_KEY} = process.env;

module.exports = {
	verifyAccount: async (req, res, next) => {
		try {
			const {token} = req.query;
			if (!token) {
				return res.status(400).json({
					status: false,
					message: "missing token",
					data: null
				});
			}

			const data = jwt.verify(token, JWT_SECRET_KEY);

			const user = await User.findOne({where: {email: data.email}});

			if (user.email_verified == true){
				return res.status(400).json({
					status: false,
					message: "user already verify",
					data: null
				});
			}

			const updated = await User.update({email_verified: true},{where: {email: data.email}});

			if(updated[0] == 0){
				return res.status(400).json({
					status: false,
					message: "verify account failed",
					data: null
				});
			}

			return res.status(200).json({
				status: true,
				message: "verify account success, now you can login with this email",
				data: null
			});
		} catch (error) {
			next(error);
		}
	}
};