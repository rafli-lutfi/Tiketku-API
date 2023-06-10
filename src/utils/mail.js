const nodemailer = require("../config/nodemailer");
const ejs = require("ejs");
const path = require("path");

const templateDirectory = `${__dirname}/../templates/`;

module.exports = {
	sendEmailVerification: async (data) => {
		try {
			const templateEmail = await ejs.renderFile(path.join(templateDirectory, "emailVerifiaction.ejs"), data);
			await nodemailer.sendMail(data.email, "Account Verification", templateEmail);
		} catch (error) {
			console.error(error);
		}
	},
};