const	express = require('express');

const	mailController = require('../controllers/mailController');

const	router = express.Router();

router.get('/', mailController.getAll)

router.post('/send_mail', mailController.sendMail);
router.post('/send_mails', mailController.sendMails);

module.exports = router;