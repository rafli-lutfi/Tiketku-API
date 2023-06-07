/* eslint-disable no-useless-catch */
const {User} = require("../db/models");
const bcrypt = require("bcrypt"); 
module.exports = {	
	register: async (req, res, next) => {
		// regiter user
		try {
			const {fullname, email, password} = req.body;
			const exist = await User.findOne({where: {email}});

			if(exist) {
				return res.status(401).json({
					status: false,
					messege: "email already used!",
					data: null
				});
			}

			const hashPassword = await bcrypt.hash(password, 10);
			const userData = {
				fullname, email, password: hashPassword
			};

			const user = await User.create(userData);
			return res.status(201).json({
				status: true,
				messege: "user created!",
				data: {
					id: user.id,
					fullname: user.fullname,
					email: user.email
				}
			});
		} catch(err){
			next(err);
		}
	}

};