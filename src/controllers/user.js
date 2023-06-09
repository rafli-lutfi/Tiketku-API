const {User, Role} = require("../db/models");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const {JWT_SECRET_KEY} = process.env;

module.exports = {	
	register: async (req, res, next) => {
		// regiter user
		try {
			const {fullname, email, phone, password} = req.body;
			const exist = await User.findOne({where: {email}});

			if(exist) {
				return res.status(400).json({
					status: false,
					messege: "email already used!",
					data: null
				});
			}

			const roleUser = await Role.findOne({where: {name: "USER"}});

			const defaultAvatar = "https://ik.imagekit.io/tiu0i2v9jz/Tiketku-API/avatar/default-avatar.png";

			const hashPassword = await bcrypt.hash(password, 10);
			const userData = {
				role_id: roleUser.id,
				fullname, 
				email, 
				phone, 
				password: hashPassword,
				avatar: defaultAvatar
			};

			const user = await User.create(userData);
			return res.status(201).json({
				status: true,
				messege: "user created!",
				data: {
					id: user.id,
					fullname: user.fullname,
					email: user.email,
					phone: user.phone,
					avatar: user.avatar,
				}
			});
		} catch(err){
			next(err);
		}
	},

	login: async (req, res, next) => {
		try {
			const {email, phone, password} = req.body;

			if (!password && (!email || !phone) ) {
				return res.status(400).json({
					status: false,
					message: "missing body request",
					data: null
				});
			}

			const user = await User.findOne({where: {email}});
			if (!user) {
				return res.status(400).json({
					status: false,
					message: "invalid credentials!",
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
				phone: user.phone
			};

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
	}
};