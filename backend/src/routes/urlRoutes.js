const express = require('express');
const router = express.Router();
const { createShortUrl, listUrls, getStats } = require('../controllers/urlController');

router.post('/urls', createShortUrl);
router.get('/urls', listUrls);
router.get('/urls/:shortcode/stats', getStats);

module.exports = router;
