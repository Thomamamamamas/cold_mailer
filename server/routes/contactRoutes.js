const	express = require('express');

const	contactController = require('../controllers/contactController');

const	router = express.Router();

router.get('/import_csv_file', contactController.importCsvFile);

module.exports = router;