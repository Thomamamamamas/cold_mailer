const	dotenv = require('dotenv');
const	fs = require('fs');

const	nodemailerMailJet = require('nodemailer-mailjet-transport');
const	nodemailer = require('nodemailer');

dotenv.config({ path: '../.env' });

exports.getTransporter = () => {
	const mailJetTransporter = nodemailerMailJet({
		auth: {
			apiKey: process.env.MAIL_JET_API_KEY,
			apiSecret: process.env.MAIL_JET_SECRET_KEY
		}
	});
	
	const	transporter = nodemailer.createTransport(mailJetTransporter);

	if (transporter == null) {
		return res.status(405).json({
			status: 'fail',
			message: "Can't get transporter !"
		});
	}

/* 	transporter.verify(function(error, success) {
	if (error) {
	  console.log("Échec de la vérification du transporteur:", error);
	  return null;
	} else {
	  console.log("Transporteur prêt à envoyer des e-mails");
	}
  }); */

	return transporter
}

exports.get_mail_html_content = (recipient_name, template) => {
	let	htmlContent = fs.readFileSync(`./template/${template}/template.html`, 'utf8');

	htmlContent = htmlContent.replace(/{RECIPIENT_NAME}/g, recipient_name).replace(/{MAIL_NAME}/g, process.env.MAIL_NAME).replace(/{MAIL_ADRESS}/g, process.env.MAIL_ADRESS)

	return htmlContent
}

exports.MailIsViable = (mail, mailList) => {
	const	falseMailFile =	fs.readFileSync('./utils/falseMailList.json', 'utf8');
	const	falseMailJSON = JSON.parse(falseMailFile)

	if (mailList.includes(mail)) {
		return false
	}

	if (mail.includes('support@')) {
		return false;
	}

	if (mail.includes("subject=")) {
		const indexOfSubject = mail.indexOf("?subject=");
		mail = mail.substring(0, indexOfSubject);
	}

	let mailIsViable = true;

	falseMailJSON.items.forEach(item => {
		if (mail.includes(item)) {
			mailIsViable = false;
			return ;
		}
	});

	if (mail.length < 4) {
		return false;
	}

	if (mailIsViable == false) {
		console.log(mail)
	}

	return mailIsViable
}