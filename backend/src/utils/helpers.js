const { nanoid } = require('nanoid');
const validator = require('validator');
const geoip = require('geoip-lite');
const { UAParser } = require('ua-parser-js');

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function generateShortcode(length = Number(process.env.SHORTCODE_LENGTH) || 6) {
  return nanoid(length).replace(/[^a-zA-Z0-9]/g, () =>
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  );
}

function isValidUrl(url) {
  if (typeof url !== 'string') return false;

  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true
  });
}

function isValidShortcode(shortcode) {
  return /^[a-zA-Z0-9]{3,20}$/.test(shortcode);
}

// Every link lives for a fixed 4 hours, then stops resolving automatically.
const LINK_LIFETIME_MINUTES = Number(process.env.LINK_LIFETIME_MINUTES) || 240;

function calculateExpiryDate() {
  return new Date(Date.now() + LINK_LIFETIME_MINUTES * 60 * 1000);
}

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    '127.0.0.1'
  );
}

function getLocationFromIp(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { country: 'Local', region: 'Local', city: 'Local' };
  }

  const geo = geoip.lookup(ip);
  return geo
    ? { country: geo.country || 'Unknown', region: geo.region || 'Unknown', city: geo.city || 'Unknown' }
    : { country: 'Unknown', region: 'Unknown', city: 'Unknown' };
}

function getDeviceInfo(userAgentString) {
  const parser = new UAParser(userAgentString || '');
  const result = parser.getResult();
  return {
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
    deviceType: result.device.type || 'desktop'
  };
}

function extractReferrer(req) {
  const referrer = req.get('Referer') || req.get('Referrer');
  if (!referrer) return 'direct';

  try {
    return new URL(referrer).hostname;
  } catch {
    return 'unknown';
  }
}

function buildShortLink(req, shortcode) {
  const base = process.env.BASE_URL || `${req.protocol}://${req.get('Host')}`;
  return `${base.replace(/\/$/, '')}/${shortcode}`;
}

module.exports = {
  generateShortcode,
  isValidUrl,
  isValidShortcode,
  calculateExpiryDate,
  getClientIp,
  getLocationFromIp,
  getDeviceInfo,
  extractReferrer,
  buildShortLink
};
