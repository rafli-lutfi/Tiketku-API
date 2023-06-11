const nodemailer = require("nodemailer");
const {oauth2Client} = require("./oauth");

const {
	GOOGLE_REFRESH_TOKEN,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_SENDER_EMAIL,
} = process.env;

oauth2Client.setCredentials({refresh_token: GOOGLE_REFRESH_TOKEN});

module.exports = {
	sendMail : async (to, subject, template) => {
		try {
			const accessToken = await oauth2Client.getAccessToken()
				.catch( error => {
					throw new Error(`error while getting acess token: ${error.message}`);
				});

			const transport = nodemailer.createTransport({
				service: "gmail",
				auth: {
					type: "OAuth2",
					user: GOOGLE_SENDER_EMAIL,
					clientId: GOOGLE_CLIENT_ID,
					clientSecret: GOOGLE_CLIENT_SECRET,
					refreshToken: GOOGLE_REFRESH_TOKEN,
					accessToken: accessToken,
				}
			});

			transport.sendMail({
				to,
				subject: `Tiketku - ${subject}`,
				html: template
				// eslint-disable-next-line no-unused-vars
			}, (err, info) => {
				if (err) {
					throw new Error(`error while sending email: ${err.message}`);
				}
			});
		} catch (error) {
			console.error(error.message);
			throw error;
		}
	}
};
