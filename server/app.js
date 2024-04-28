const { json } = require('express');
const	express = require('express');
const	helmet = require('helmet');
const	cookieParser = require('cookie-parser');
const	dotenv = require("dotenv");

dotenv.config({ path: '../.env' });

const	app = express();

const	categoryRouter = require('./routes/mailRoutes');

app.use(helmet())

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', process.env.BASE_URL);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	} 
	else {
		next();
	}
});

app.use('/api/mail', categoryRouter);

module.exports = app;