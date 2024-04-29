const	mongoose = require('mongoose');

const	mailSendSchema = new mongoose.Schema({
	recipient: {
		type: String,
		required: [true, "A mail need a recipient"]
	},
	subject: {
		type: String,
		required: [true, "A mail need a subject"]
	},
	sended: Boolean,
	opened: Boolean,
	clicked: Boolean,
	disfollow: Boolean,
	blocked: Boolean,
	spam: Boolean,
	responded: Boolean
});

const	MailSend = mongoose.model('mails_send', mailSendSchema, 'mails_send');

module.exports = MailSend;