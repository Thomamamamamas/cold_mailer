const	factory = require('./factoryHandler');
const	dotenv = require('dotenv');
const	fs = require('fs');

const	MailSend = require('../models/mailSendModel');
const	Contact = require('../models/contactModel');
const { getTransporter, get_mail_html_content, MailIsViable } = require('../utils/mail');

dotenv.config({ path: '../../.env' });

exports.getAll = factory.getAll(MailSend);

exports.sendMail = async (req, res, next) => {
	try {
		if (!req.body.recipient_mail || !req.body.recipient_name || !req.body.template) {
			return res.status(401).json({
				status: 'fail',
				message: 'Certaines variables sont manquantes dans le body'
			});
		}
		const	transporter = getTransporter();
		const	jsonInfo = fs.readFileSync(`./template/${req.body.template}/info.json`, 'utf8');
		const	objectJSON = JSON.parse(jsonInfo);
		
		const	htmlContent = get_mail_html_content(req.body.recipient_name, req.body.template);
		
		const	mailOptions = {
			from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_ADRESS}>`,
			to: `${req.body.recipient_mail}`,
			subject: `${objectJSON.subject}`,
			text: `${objectJSON.text.replace(/{RECIPIENT_NAME}/g, req.body.recipient_name).replace(/{MAIL_NAME}/g, process.env.MAIL_NAME).replace(/{MAIL_ADRESS}/g, process.env.MAIL_ADRESS)}`,
			html: htmlContent,
		}

		await transporter.sendMail(mailOptions, (err) => {
			if (err) {
				return res.status(401).json({
					status: 'success',
					message: `Error for sending mail : ${err.message}`
				});
			}
		});

		await MailSend.create({recipient: req.body.recipient_mail, subject: objectJSON.subject})

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

exports.sendMails = async (req, res, next) => {
	try {
		let recipients = [];

		if (!req.body.template || !req.body.nb_contact) {
			return res.status(401).json({
				status: 'fail',
				message: 'Certaines variables sont manquantes dans le body'
			});
		}
		if (!req.body.recipients) {
			let tmp = await Contact.find({category: { $in: req.body.categories }});
			tmp.forEach(item => {
				if (MailIsViable(item.mail, recipients_mail) == true && recipients_mail.length < req.body.nb_contact) {
					recipients.push({_id: item._id, name: item.name, mail: item.mail})
				}
			})
		}
		else {
			req.body.recipients.forEach(item => {
				recipients.push({_id: undefined, name: item.name, mail: item.mail})
			})
		}

		const	transporter = getTransporter();
		const	jsonInfo = fs.readFileSync(`./template/${req.body.template}/info.json`, 'utf8');
		const	objectJSON = JSON.parse(jsonInfo);
		
		
		for (let i = 0; i < recipients.length; i++) {
			const	htmlContent = get_mail_html_content(recipients[i].name, req.body.template);

			const	mailOptions = {
				from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_ADRESS}>`,
				to: `${recipients[i].mail}`,
				subject: `${objectJSON.subject}`,
				text: `${objectJSON.text.replace(/{RECIPIENT_NAME}/g, recipients[i].name).replace(/{MAIL_NAME}/g, process.env.MAIL_NAME).replace(/{MAIL_ADRESS}/g, process.env.MAIL_ADRESS)}`,
				html: htmlContent,
			}
	
			await transporter.sendMail(mailOptions, (err) => {
				if (err) {
					return res.status(401).json({
						status: 'success',
						message: `Error for sending mail : ${err.message}`
					});
				}
			});
	
			await MailSend.create({recipient: recipients[i].mail, subject: objectJSON.subject});
			if (recipients[i]._id != undefined) {
				await Contact.findByIdAndUpdate(recipients[i]._id, {first_contact: true});
			}
		}
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