require('dotenv').config();
const createApp = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/middleware/logger');

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  const app = createApp();

  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: String(reason) });
});

start();
