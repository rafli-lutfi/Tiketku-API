const {User} = require("../db/models");
const bcrypt = require("bcrypt");
module.exports = {
	login: async (req, res, next) => {
        try {
            const {email, password} = req.body;

            const user = await User.findOne({where: {email}});
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'email or password is not correct!',
                    data: null
                });
            }

            const passwordCorrect = await bcryp.compare(password, user.password);
            if (!passwordCorrect) {
                return res.status(404).json({
                    status: false,
                    message: 'email or password is not correct!',
                    data: null
                });
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            const token = await jwt.sign(payload, JWT_SECRET_KEY);
            return res.status(200).json({
                status: true,
                message: 'success!',
                data: {
                    token: token
                }
            });

        } catch (err) {
            next(err);
        }
    }
};