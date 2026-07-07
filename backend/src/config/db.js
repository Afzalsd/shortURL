const mongoose = require('mongoose');
const logger = require('../middleware/logger');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/url_shortener';

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected', { host: mongoose.connection.host, db: mongoose.connection.name });
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB runtime error', { error: error.message });
  });
}

module.exports = connectDB;
