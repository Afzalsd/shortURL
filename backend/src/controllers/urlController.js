const Url = require('../models/Url');
const logger = require('../middleware/logger');
const {
  generateShortcode,
  isValidUrl,
  isValidShortcode,
  calculateExpiryDate,
  getClientIp,
  getLocationFromIp,
  getDeviceInfo,
  extractReferrer,
  buildShortLink
} = require('../utils/helpers');

async function createShortUrl(req, res, next) {
  try {
    const { url, shortcode } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'url is required' });
    }
    if (!isValidUrl(url)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid http/https URL' });
    }

    let finalShortcode = shortcode;

    if (finalShortcode) {
      if (!isValidShortcode(finalShortcode)) {
        return res.status(400).json({ success: false, message: 'shortcode must be 3-20 alphanumeric characters' });
      }
      const exists = await Url.exists({ shortcode: finalShortcode });
      if (exists) {
        return res.status(409).json({ success: false, message: 'shortcode already in use' });
      }
    } else {
      let attempts = 0;
      do {
        finalShortcode = generateShortcode();
        attempts++;
        if (attempts > 10) {
          return res.status(500).json({ success: false, message: 'Could not generate a unique shortcode, please retry' });
        }
      } while (await Url.exists({ shortcode: finalShortcode }));
    }

    const expiryDate = calculateExpiryDate();
    const doc = await Url.create({ shortcode: finalShortcode, originalUrl: url, expiryDate });

    logger.info('Short URL created', { shortcode: finalShortcode, url });

    res.status(201).json({
      success: true,
      data: {
        shortcode: doc.shortcode,
        shortLink: buildShortLink(req, doc.shortcode),
        originalUrl: doc.originalUrl,
        expiry: doc.expiryDate.toISOString(),
        createdAt: doc.createdAt.toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
}

async function listUrls(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const docs = await Url.find().sort({ createdAt: -1 }).limit(limit);
    res.json({
      success: true,
      data: docs.map((doc) => ({
        shortcode: doc.shortcode,
        shortLink: buildShortLink(req, doc.shortcode),
        originalUrl: doc.originalUrl,
        createdAt: doc.createdAt.toISOString(),
        expiryDate: doc.expiryDate.toISOString(),
        isActive: doc.isActive && !doc.isExpired,
        totalClicks: doc.clicks.length
      }))
    });
  } catch (error) {
    next(error);
  }
}

async function getStats(req, res, next) {
  try {
    const { shortcode } = req.params;
    if (!isValidShortcode(shortcode)) {
      return res.status(400).json({ success: false, message: 'Invalid shortcode format' });
    }

    const doc = await Url.findOne({ shortcode });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Short URL not found' });
    }

    res.json({
      success: true,
      data: {
        shortcode: doc.shortcode,
        originalUrl: doc.originalUrl,
        createdAt: doc.createdAt.toISOString(),
        expiryDate: doc.expiryDate.toISOString(),
        isActive: doc.isActive && !doc.isExpired,
        totalClicks: doc.clicks.length,
        clicks: doc.clicks
      }
    });
  } catch (error) {
    next(error);
  }
}

async function redirectToOriginal(req, res, next) {
  try {
    const { shortcode } = req.params;
    const doc = await Url.findOne({ shortcode });

    if (!doc || !doc.isActive || new Date() > doc.expiryDate) {
      return res.status(404).json({ success: false, message: 'This link does not exist or has expired' });
    }

    const ip = getClientIp(req);
    const location = getLocationFromIp(ip);
    const device = getDeviceInfo(req.get('User-Agent'));

    doc.clicks.push({
      ip,
      referrer: extractReferrer(req),
      ...location,
      ...device
    });
    await doc.save();

    logger.info('Redirect served', { shortcode, totalClicks: doc.clicks.length });

    res.redirect(302, doc.originalUrl);
  } catch (error) {
    next(error);
  }
}

module.exports = { createShortUrl, listUrls, getStats, redirectToOriginal };
