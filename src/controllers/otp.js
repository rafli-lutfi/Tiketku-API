const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
	},

	resetPassword: async (req, res, next) => {
		try {
			const {token} = req.query;
			if (!token) {
				return res.status(400).json({
					status: false,
					message: "missing token",
					data: null
				});
			}

			const data = jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
				if (err) throw new Error(err.message);
				return decoded;
			});

			const {new_password, confirm_new_password} = req.body;
			if(!new_password || !confirm_new_password) {
				return res.status(400).json({
					status: false,
					message: "missing body request",
					data: null
				});
			}

			if(new_password != confirm_new_password) {
				return res.status(400).json({
					status: false,
					message: "confirm password not match!",
					data: null
				});
			}

			const hashPassword = await bcrypt.hash(new_password, 10);
			
			await User.update({password: hashPassword}, {where: {email: data.email}});

			return res.status(200).json({
				status: true,
				message: "success reset password",
				data: null
			});
		} catch (error) {
			if(error.message == "jwt expired"){
				return res.status(401).json({
					status: false,
					message: error.message,
					data: null
				});
			}
			next(error);
		}
	}
};