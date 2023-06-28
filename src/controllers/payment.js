const {Order, Payment, } = require("../db/models");
const moment = require("moment-timezone");
const convert = require("../utils/convert");
const respone = require("../utils/respone");

module.exports = {
	confirmPayment: async (req,res,next) => {
		try {
			const {id : user_id} = req.user;
			const {order_id, payment_type} = req.body;

			const checkOrder = await Order.findOne({
				where: {id: order_id, user_id},
				attributes: {exclude: ["createdAt", "updatedAt"]}
			});

			// update order if status is UNPAID and order has expired
			if (checkOrder.status == "UNPAID" && moment().isAfter(convert.databaseToDateFormat(checkOrder.paid_before))){
				await Order.update({status: "CANCELED"},{
					where: {id: order_id},
				});

				return res.status(400).json({
					status: false,
					message: "order has expired",
					data: null
				});
			}

			if (checkOrder.status == "PAID"){
				return res.status(400).json({
					status: false,
					message: "order has been paid",
					data: null
				});
			}

			if (checkOrder.status == "CANCELED"){
				return res.status(400).json({
					status: false,
					message: "order has been canceled",
					data: null
				});
			}

			await Payment.create({order_id, type: payment_type});

			await Order.update({status: "PAID"}, {where: {id: order_id}});

			return respone.successOK(res, "payment success");
		} catch (error) {
			next(error);
		}
	},
};