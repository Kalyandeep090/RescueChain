const express = require('express');
const router = express.Router();
const { getAlerts, createAlert, updateAlertStatus } = require('../controllers/alertController');


router.get('/', getAlerts);
router.post('/', createAlert);
router.patch('/:id/status', updateAlertStatus);

module.exports = router;
