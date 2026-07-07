const express = require('express');
const router = express.Router();
const { redirectToOriginal } = require('../controllers/urlController');

router.get('/:shortcode', redirectToOriginal);

module.exports = router;
