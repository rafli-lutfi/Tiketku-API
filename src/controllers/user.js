/* eslint-disable no-useless-catch */
const {User} = require("../db/models");
const bcrypt = require("bcrypt"); 
const jwt = requier("jsonwebtoken");

module.exports = {	
	register: async (req, res, next) => {
		// regiter user
		try {
			const {fullname, email, password} = req.body;
			const exist = await User.findOne({where: {email}});

			if(exist) {
				return res.status(400).json({
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
	},

	login: async (req, res, next) => {
        try {
            const {email, password} = req.body;

            const user = await User.findOne({where: {email}});
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "Alamat email tidak terdaftar!",
                    data: null
                });
            }

            const passwordCorrect = await bcrypt.compare(password, user.password);
            if (!passwordCorrect) {
                return res.status(400).json({
                    status: false,
                    message: "Maaf, kata sandi salah",
                    data: null
                });
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            const token =  jwt.sign(payload, JWT_SECRET_KEY);
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
    }
}