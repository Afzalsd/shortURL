const logger = require('./logger');

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
}

function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl
  });

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
}

module.exports = { notFoundHandler, errorHandler };
