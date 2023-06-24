const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {User} = require("../db/models");
const {JWT_SECRET_KEY} = process.env;
const mail = require("../utils/mail");
const otp = require("../utils/otp");

module.exports = {
	resendEmailVerfication: async (req, res, next) => {
		try {
			const {token} = req.query;
			const {email} = req.body;

			jwt.verify(token, JWT_SECRET_KEY, async (err) => {
				if(err){
					if(err.name != "TokenExpiredError"){
						return res.status(401).json({
							status: false,
							message: err.message,
							data: null,
						});	
					}
				}

				const user = await User.findOne({where: {email: email}});

				const otpCode = otp.generateOTP();

				const payload = {
					email: user.email,
					otp: otpCode
				};
			
				const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "5m"});
				const url = `${req.protocol}://${req.get("host")}/register/verifyAccount?token=${token}`;

				mail.sendEmailVerification({fullname: user.fullname, email: user.email, otp: otpCode, url});
				return res.status(200).json({
					status: false,
					message: "success resend email",
					data: {
						email: user.email,
						token
					}
				});
			});
		} catch (error) {
			next(error);
		}
	},

	verifyAccount: async (req, res, next) => {
		try {
			const {token} = req.query;

			const data = jwt.verify(token, JWT_SECRET_KEY);
			if(!data.email || !data.otp){
				return res.status(401).json({
					status: false,
					message: "invalid token",
					data: null
				});
			}

			const user = await User.findOne({where: {email: data.email}});

			if (user.email_verified == true){
				return res.status(400).json({
					status: false,
					message: "user already verify",
					data: null
				});
			}

			const {otp} = req.body;
			if(!otp) {
				return res.status(400).json({
					status: false,
					message: "missing otp input",
					data: null
				});
			}

			if (otp != data.otp){
				return res.status(400).json({
					status: false,
					message: "invalid otp",
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
			if(error.name == "TokenExpiredError"){
				return res.status(401).json({
					status: false,
					message: "token expired",
					data: null,
				});
			}
			next(error);
		}
	},

	resetPassword: async (req, res, next) => {
		try {
			const {token} = req.query;
			const {new_password} = req.body;

			const data = jwt.verify(token, JWT_SECRET_KEY);
			
			const hashPassword = await bcrypt.hash(new_password, 10);
			
			await User.update({password: hashPassword}, {where: {email: data.email}});

			return res.status(200).json({
				status: true,
				message: "success reset password",
				data: null
			});
		} catch (error) {
			if(error.name == "TokenExpiredError"){
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