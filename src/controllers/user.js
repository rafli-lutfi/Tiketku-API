const {User, Role} = require("../db/models");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const mail = require("../utils/mail");
const otp = require("../utils/otp");
const oauth = require("../config/oauth");
const notif = require("../utils/notifications");
const {JWT_SECRET_KEY} = process.env;

module.exports = {	
	register: async (req, res, next) => {
		// regiter user
		try {
			const {fullname, email, phone, password} = req.body;

			const roleUser = await Role.findOne({where: {name: "USER"}, attributes: {exclude: ["createdAt", "updatedAt"]}});

			const defaultAvatar = "https://ik.imagekit.io/tiu0i2v9jz/Tiketku-API/avatar/default-avatar.png";

			const hashPassword = await bcrypt.hash(password, 10);
			const userData = {
				role_id: roleUser.id,
				fullname, 
				email, 
				phone, 
				password: hashPassword,
				avatar: defaultAvatar,
				email_verified: false,
				user_type: "basic"
			};

			const user = await User.create(userData);
			const otpCode = otp.generateOTP();

			const payload = {
				email: user.email,
				otp: otpCode
			};
			
			const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "5m"});
			const url = `${req.protocol}://${req.get("host")}/register/verifyAccount?token=${token}`;

			mail.sendEmailVerification({fullname: user.fullname, email: user.email, otp: otpCode, url});

			return res.status(201).json({
				status: true,
				messege: "user created!",
				data: {
					email: user.email,
					token: token,
				}
			});
		} catch(err){
			next(err);
		}
	},

	login: async (req, res, next) => {
		try {
			const {email, password} = req.body;

			const user = await User.findOne({
				where: {email}, 
				include: {
					model: Role,
					as: "role"				
				},
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				}
			});

			if (!user) {
				return res.status(400).json({
					status: false,
					message: "invalid credentials!",
					data: null
				});
			}

			if(user.user_type == "google"){
				return res.status(400).json({
					status: false,
					message: "your account is registered using google, please login with google",
					data: null
				});
			}

			if(!user.email_verified){
				return res.status(400).json({
					status: false,
					message: "your account is not verified, please check your email to verify",
					data: null
				});
			}

			const passwordCorrect = await bcrypt.compare(password, user.password);
			if (!passwordCorrect) {
				return res.status(400).json({
					status: false,
					message: "invalid credentials!",
					data: null
				});
			}

			const payload = {
				id: user.id,
				fullname: user.fullname,
				email: user.email,
				phone: user.phone,
				role: user.role.name
			};

			const notifData = [{
				title: "Login activity",
				description: "there is login activity in your account!",
				user_id: user.id
			}];

			notif.sendNotif(notifData);

			const token =  jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "1d"});
			return res.status(200).json({
				status: true,
				message: "success!",
				data: {
					token: token
				}
			});

		} catch (err) {
			next(err);
		}
	},

	googleOauth2: async (req, res, next) => {
		try {
			const {code} = req.query;
			if (!code) {
				const googleLoginUrl = oauth.generateAuthUrl();
				return res.redirect(googleLoginUrl);
			}

        
			await oauth.setCreadentials(code);
			const {data} = await oauth.getUserData();
        
			let user = await User.findOne({where: {email: data.email}});
			if (!user) {
				user = await User.create({
					role_id: 2,
					fullname: data.name,
					email: data.email,
					avatar: data.picture,
					email_verified: data.verified_email,
					user_type: "google",
				});
			}


			const payload = {
				id: user.id,
				fullname: user.fullname,
				email: user.email
			};

			const notifData = [{
				title: "Login activity",
				description: "there is login activity in your account!",
				user_id: user.id
			}];

			notif.sendNotif(notifData);

			const token = await jwt.sign(payload, JWT_SECRET_KEY);
			return res.status(200).json({
				status: true,
				message: "login success!",
				data: {
					token: token
				}
			});
		} catch (error) {
			next(error);
		}
	},

	updateProfile: async (req, res, next) => {
		try {
			const {fullname, email, phone} = req.body;
			let {avatar} = req.body;

			if (req.uploadFile) {
				avatar = req.uploadFile.imageUrl;
			}

			if(!fullname && !email && !phone && !avatar) {
				return res.status(400).json({
					status: false,
					message: "missing body request",
					data: null
				});
			}

			const {id: userId} = req.user;

			const checkUser = User.findOne({where: {id: userId}});
			if (!checkUser) {
				return res.status(400).json({
					status: false,
					message: "user not found",
					data : null
				});
			}

			await User.update({fullname, email, phone, avatar}, {where: {id: userId}});

			return res.status(200).json({
				status: true,
				message: "success update profile",
				data: {
					fullname,
					email,
					phone,
					avatar
				}
			});
		} catch (error) {
			next(error);
		}
	},

	forgotPassword: async (req, res, next) => {
		try {
			const {email} = req.body;

			const user = await User.findOne({where: {email}, attributes: {exclude : ["createdAt", "updatedAt"]}});
			let token;

			if(user){
				const payload = {
					email: user.email
				};
				
				token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "10m"});
				const url = `${req.protocol}://${req.get("host")}/user/resetPassword?token=${token}`;

				await mail.sendForgotPassword({email:user.email, url});
			}

			return res.status(200).json({
				status: true,
				message: "we will send an email if the email is registered!",
				data: {
					token,
				}
			});
		} catch (error) {
			next(error);
		}
	},
	
	getDetail: async (req, res, next) => {
		try {
			const {id} = req.user;
			if (!id) {
				return res.status(400).json({
					status: false,
					message: "missing id user",
					data: null
				});
			}

			const detailUser = await User.findOne({
				where: {id}, 
				attributes: ["fullname", "email", "phone"],
				required: true
			});

			if (!detailUser) {
				return res.status(400).json({
					status: false,
					message: "user not found",
					data: null
				});
			}

			return res.status(200).json({
				status: true,
				message: "success get detail user",
				data: detailUser
			});
		} catch (error) {
			next(error);
		}
	},
};