const {User, Role} = require("../db/models");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const mail = require("../utils/mail");
const otp = require("../utils/otp");
const oauth = require("../config/oauth");
const notif = require("../utils/notifications");
const {JWT_SECRET_KEY} = process.env;
const respone = require("../utils/respone");

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

			const data = {
				email: user.email,
				token: token
			};

			return respone.successCreated(res, "user created!", data);

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
				return respone.errorBadRequest(res, "invalid credentials!", "wrong email or password");
			}

			if(user.user_type == "google"){
				return respone.errorBadRequest(res, 
					"account was registered using google, please login with google", 
					"user try login without google, but registerd using google"
				);
			}

			if(!user.email_verified){
				return respone.errorBadRequest(res, "account is not verified", "user try login but email not verified yet");
			}

			const passwordCorrect = await bcrypt.compare(password, user.password);
			if (!passwordCorrect) {
				return respone.errorBadRequest(res, "invalid credentials!", "wrong email or password");
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
			
			return respone.successOK(res, "success!", {token});

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

			return respone.successOK(res, "login success!", {token});

		} catch (error) {
			next(error);
		}
	},

	updateProfile: async (req, res, next) => {
		try {
			const {fullname, email, phone} = req.body;

			let avatar;
			if (req.uploadFile) {
				avatar = req.uploadFile.imageUrl;
			}

			if(!fullname && !email && !phone && !avatar){
				return respone.errorBadRequest(
					res, 
					"missing body request", 
					"One of these (emails, fullname, phone) must be filled in."
				);
			}

			const {id: userId} = req.user;

			const checkUser = User.findOne({where: {id: userId}});
			if (!checkUser) return respone.errorBadRequest(res, "user not found", `user with id ${userId} not found`);

			await User.update({fullname, email, phone, avatar}, {where: {id: userId}});

			const data = {
				fullname,
				email,
				phone,
				avatar
			};

			return respone.successOK(res, "success update profile", data);

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

			return respone.successOK(res, "we will send an email if the email is registered", {token: token ? token : null});

		} catch (error) {
			next(error);
		}
	},
	
	getDetail: async (req, res, next) => {
		try {
			const {id} = req.user;
			if (!id) {
				return respone.errorBadRequest(res, "missing user id");
			}

			const detailUser = await User.findOne({
				where: {id}, 
				attributes: ["fullname", "email", "phone", "avatar"],
				required: true
			});

			if (!detailUser) {
				return respone.errorBadRequest(res, "user not found", `user with id ${id} not found`);
			}

			return respone.successOK(res, "success get detail user", detailUser);

		} catch (error) {
			next(error);
		}
	},
};
