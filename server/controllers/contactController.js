const	fs = require('fs');
const	csvParser = require('csv-parser');

const Contact = require('../models/contactModel');

exports.importCsvFile = async (req, res, next) => {
	try {
		let items = [];

		fs.createReadStream('./import/import.csv')
		.pipe(csvParser())
		.on('data', (row) => {
			items.push({
				name: row.nom,
				adresse: row[' addresse'].replace(' ', '').replace(/"/g, ''),
				phone: row[' téléphone'].replace(/ /g, '').replace(/"/g, ''),
				website: row[' site internet'].replace(/ /g, '').replace(/"/g, ''),
				mail: row[' email'].replace(/ /g, '').replace(/"/g, ''),
				country: row[' country'].replace(' ', '').replace(/"/g, ''),
				city: row[' city'].replace(' ', '').replace(/"/g, ''),
				category: row[' category'].replace(' ', '').replace(/"/g, '')
			});
		})
		.on('end', async () => {
			try{
				for (let i = 0; i < items.length; i++) {
					if (items[i].name != "" && items[i].mail != "") {
						await Contact.findOneAndUpdate({name: items[i].name, mail: items[i].name}, items[i], { upsert: true});
					}
				}
				return res.status(200).json({
					status: 'success',
					message: "Csv file imported with success !"
				});
			}
			catch (err) {
				return res.status(402).json({
					status: 'fail',
					message: `Can't save contact : ${err.message}`
				});
			}
		})
		.on('error', (err) => {
			return res.status(401).json({
				status: 'fail',
				message: `Can't get contact from csv file : ${err.message}`
			});
		});
	} 
	catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message
		});
	}
}