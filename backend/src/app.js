const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const urlRoutes = require('./routes/urlRoutes');
const redirectRoutes = require('./routes/redirectRoutes');

function createApp() {
  const app = express();

  app.set('trust proxy', true);
  app.use(helmet({ contentSecurityPolicy: false }));

  const allowedOrigins = (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim());
  app.use(cors({ origin: allowedOrigins }));

  app.use(express.json({ limit: '1mb' }));
  app.use(logger.requestLogger);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api', urlRoutes);
  // Bare redirect route must be last - it matches any /:shortcode
  app.use('/', redirectRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
