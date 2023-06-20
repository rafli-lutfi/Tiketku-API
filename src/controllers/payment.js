const {Order, Payment, } = require("../db/models");

module.exports = {
	confirmPayment: async (req,res,next) => {
		try {
			const {id : user_id} = req.user;
			const {order_id} = req.params;
			const {payment_type} = req.body;

			if(!payment_type){
				return res.status(400).json({
					status: false,
					message: "missing request body",
					data: null
				});
			}

			const checkOrder = await Order.findOne({
				where: {id: order_id, user_id},
				attributes: {exclude: ["createdAt", "updatedAt"]}
			});

			if(!checkOrder){
				return res.status(400).json({
					status: "false",
					message: "order not found",
					data: null
				});
			}

			if (checkOrder.status != "UNPAID"){
				return res.status(400).json({
					status: false,
					message: "order has been paid",
					data: null
				});
			}

			await Payment.create({order_id, type: payment_type});

			await Order.update({status: "PAID"}, {where: {id: order_id}});

			return res.status(201).json({
				status: true,
				message: "payment success",
				data: null
			});
		} catch (error) {
			next(error);
		}
	},
};