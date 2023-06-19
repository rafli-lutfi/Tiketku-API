/* eslint-disable no-undef */
/* eslint-disable no-useless-catch */
const {Notification} = require("../db/models");

module.exports = {
	index: async (req, res, next) => {
		try {
			const { id: user_id } = req.user;

			const notifications = await Notification.findAll({ 
				where: { 
					user_id, 
				},
				order: [
					["createdAt", "DESC"] 
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				},
			},);

			return res.status(200).json({
				status: true,
				message: "Success",
				data: [
					notifications
				]
			});

		} catch (error){
			next(error);
		}
	},

	readNotif: async (req, res, next) => {
		try {
			const {id} = req.params;
			await Notification.update({is_read: true}, {where: {id, user_id: req.user.id}});

			return res.status(200).json({
				status: true,
				message: "success",
				data: null
			});
		} catch (error) {
			next(error);
		}
	},

	unRead: async (req, res, next) => {
		try {
			const { id: user_id } = req.user;

			const notifications = await Notification.findAll({ 
				where: { 
					user_id, is_read: false
				},
				order: [
					["createdAt", "DESC"] 
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"]
				},
			},);

			return res.status(200).json({
				status: true,
				message: "Success",
				data: [
					notifications
				]
			});
		} catch (error) {
			next(error);
		}
	}
    
};