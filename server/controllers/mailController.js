const	factory = require('./factoryHandler');
const	dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });
const	MailSend = require('../models/mailSendModels');
const { getTransporter } = require('../utils/mail');
const { contentSecurityPolicy } = require('helmet');

exports.getAll = factory.getAll(MailSend);

exports.sendMail = async (req, res, next) => {
	try {
		const	transporter = getTransporter();

		if (!req.body.subject || !req.body.text || !req.body.html) {
			return res.status(401).json({
				status: 'fail',
				message: 'Certaines variables sont manquantes dans le body'
			});
		}
		
		const	mailOptions = {
			from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_ADRESS}>`,
			to: `${req.body.recipient_mail}`,
			subject: `${req.body.subject}`,
			text: `${req.body.text}`,
			html: `${req.body.html}`,
		}

		await transporter.sendMail(mailOptions, (err) => {
			if (err) {
				return res.status(401).json({
					status: 'success',
					message: `Error for sending mail : ${err.message}`
				});
			}
		});
		return res.status(200).json({
			status: 'success',
			message: 'mail send with success'
		});
	}
	catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message
		});
	}
}