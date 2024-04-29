const	mongoose = require('mongoose');

const	contactSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A Contact need a name"]
	},
	adresse: String,
	phone: String,
	website: String,
	mail: {
		type: String,
		required: [true, "A Contact need a mail"]
	},
	country: String,
	city: String,
	category: String,
	first_contact: {
		type: Boolean,
		default: false
	},
	respond: {
		type: Boolean,
		default: false
	},
	client: {
		type: Boolean,
		default: false
	}
});

const	Contact = mongoose.model('contacts', contactSchema, 'contacts');

module.exports = Contact;