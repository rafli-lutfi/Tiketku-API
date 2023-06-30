const {Order, Payment, User, Flight, Passenger, Airplane, Airline, Airport, Price} = require("../db/models");
const moment = require("moment-timezone");
const convert = require("../utils/convert");
const respone = require("../utils/respone");
const mail = require("../utils/mail");
const {TZ = "Asia/Jakarta"} = process.env;

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

			const order = await Order.findOne({
				where: {id: order_id, user_id},
				include: [
					{
						model: User,
						as: "buyer",
						attributes: {exclude:  ["createdAt", "updatedAt"]},
						required: true
					},
					{
						model: Flight,
						as: "flight",
						include: [
							{
								model: Airplane,
								as: "airplane",
								include: {
									model: Airline,
									as: "airline",
									attributes: {
										exclude: ["id", "createdAt", "updatedAt"]
									},
									required: true,
								},
								attributes: {
									exclude: ["createdAt", "updatedAt"]
								},
								required: true	
							},
							{
								model: Airport,
								as: "departure_airport",
								attributes: {
									exclude: ["createdAt", "updatedAt"]
								},
								required: true
							},
							{
								model: Airport,
								as: "arrival_airport",
								attributes: {
									exclude: ["createdAt", "updatedAt"]
								},
								required: true
							},
						],
						attributes: {exclude:  ["createdAt", "updatedAt"]},
						required: true
					},
					{
						model: Passenger,
						as: "passengers",
						attributes: {exclude:  ["createdAt", "updatedAt"]},
						required: true
					},
					{
						model: Payment,
						as: "payment",
						attributes: {exclude:  ["createdAt", "updatedAt"]},
						required: true
					},
				],
				attributes: {exclude: ["createdAt"]},
			});

			const price = await Price.findOne({
				where: {flight_id: order.flight.id, seat_type: order.seat_type},
			});

			// count age group in passengers data
			let adult = 0, child = 0, infant = 0;
			const passengers = order.passengers.map(passenger => {
				if (passenger.age_group == "adult") adult++;
				if (passenger.age_group == "child") child++;
				if (passenger.age_group == "infant") infant++;
				return {
					title: passenger.title,
					fullname: passenger.fullname,
					ktp: passenger.ktp
				};
			});

			const data = {
				paidAt: convert.databaseToDateFormat(order.updatedAt),
				booking_code: order.booking_code,
				payment_type: order.payment.type,
				seat_type: order.seat_type,
				status: order.status,
				user: {
					fullname: order.buyer.fullname,
					email: order.buyer.email,
					phone: order.buyer.phone
				},
				flight: {
					airline_name: order.flight.airplane.airline.name,
					flight_number: order.flight.flight_number,
					date: moment(order.flight.date).tz(TZ).format("DD MMMM YYYY"),
					departure: {
						airport_name: order.flight.departure_airport.name,
						airport_iata: order.flight.departure_airport.airport_iata,
						time: convert.timeWithTimeZone(order.flight.departure_time)
					},
					arrival: {
						airport_name: order.flight.arrival_airport.name,
						airport_iata: order.flight.arrival_airport.airport_iata,
						time: convert.timeWithTimeZone(order.flight.arrival_time)
					},
				},
				price: {
					adult_count: adult,
					child_count: child ? child : null,
					infant_count: infant ? infant : null,
					adult_price: convert.NumberToCurrency(adult * price.price),
					child_price: child == 0 ? null : convert.NumberToCurrency(child * price.price),
					infant_price: infant == 0 ? null : convert.NumberToCurrency(0),
					tax: convert.NumberToCurrency(order.tax),
					total_price: convert.NumberToCurrency(order.total_price + order.tax)
				},
				passengers
			};

			mail.sendInvoice(data);

			return respone.successOK(res, "payment success");
		} catch (error) {
			next(error);
		}
	},
};