const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    ip: String,
    referrer: { type: String, default: 'direct' },
    country: { type: String, default: 'Unknown' },
    region: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' },
    os: { type: String, default: 'Unknown' },
    deviceType: { type: String, default: 'desktop' }
  },
  { _id: false }
);

const urlSchema = new mongoose.Schema(
  {
    shortcode: { type: String, required: true, unique: true, index: true },
    originalUrl: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    clicks: { type: [clickSchema], default: [] }
  },
  { timestamps: true }
);

urlSchema.virtual('totalClicks').get(function () {
  return this.clicks.length;
});

urlSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiryDate;
});

urlSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Url', urlSchema);
