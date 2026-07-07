const levels = ['debug', 'info', 'warn', 'error'];

function log(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    ...meta
  };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

const logger = {};
levels.forEach((level) => {
  logger[level] = (message, meta) => log(level, message, meta);
});

// Express middleware: logs each request/response with timing
function requestLogger(req, res, next) {
  const start = Date.now();

  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });

  res.on('finish', () => {
    logger.info('Response sent', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start
    });
  });

  next();
}

module.exports = logger;
module.exports.requestLogger = requestLogger;
