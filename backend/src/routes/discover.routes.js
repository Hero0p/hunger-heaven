const express = require('express');
const router = express.Router();
const discoverController = require('../controllers/discover.controller');

router.get('/', discoverController.getDiscover);

module.exports = router;
