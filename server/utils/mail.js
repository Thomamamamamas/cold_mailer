const	dotenv = require('dotenv');

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