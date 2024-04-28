const	mongoose = require('mongoose');
const	dotenv = require('dotenv');
const	nodemailer = require('nodemailer');

dotenv.config({ path: '../.env' });
const app = require('./app');

main().catch(err => console.log(err));

async function main()
{
	const DB = process.env.CONNECTION_STRING.replace('<PASSWORD>', process.env.PASSWORD).replace('<USERNAME>', process.env.USERNAME);
	let bdd = await mongoose.connect(DB); 
	console.log("Connection à la BDD réussie !");

	const port = process.env.PORT || 3000;
	app.listen(port, () => {
	console.log(`App running on port ${port}...`);
	});
};