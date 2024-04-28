const	mongoose = require('mongoose');

const	mailSendSchema = new mongoose.Schema({

});

const	MailSend = mongoose.model('mails_send', mailSendSchema, 'mails_send');

module.exports = MailSend