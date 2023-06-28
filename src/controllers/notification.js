const {Notification} = require("../db/models");
const respone = require("../utils/respone");

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

			return respone.successOK(res, "success", notifications);

		} catch (error){
			next(error);
		}
	},

	readNotif: async (req, res, next) => {
		try {
			const {id} = req.params;

			if(!id) return respone.errorBadRequest(
				res, 
				"Invalid requestd", 
				"Missing id parameter."
			);

			const notification = await Notification.findOne({
				where: { id, user_id: req.user.id }
			});

			if(!notification) return respone.errorBadRequest(
				res, 
				"Notification not found."
			);

			await Notification.update({is_read: true}, {where: {id, user_id: req.user.id}});

			return respone.successOK(res, "success");
		} catch (error) {
			next(error);
		}
	},

	unRead: async (req, res, next) => {
		try {
			const { id: user_id } = req.user;

			const unRead = await Notification.findAll({ 
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

			return respone.successOK(res, "success", unRead);

		} catch (error) {
			next(error);
		}
	}
    
};