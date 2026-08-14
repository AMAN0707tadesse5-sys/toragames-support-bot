const express = require('express');
const bot = require('./bot');
const config = require('./config');
const logger = require('./logger');

async function start() {
  if (config.WEBHOOK_URL) {
    // ------------------------------------------------------------------
    // PRODUCTION MODE (Render): webhook via Express
    // ------------------------------------------------------------------
    const app = express();
    app.use(express.json());

    const webhookPath = `/webhook/${config.WEBHOOK_SECRET_PATH}`;

    // Health check endpoint — Render pings "/" to confirm the service is alive.
    app.get('/', (_req, res) => {
      res.status(200).send('toragames-support-bot: OK');
    });

    app.use(bot.webhookCallback(webhookPath));

    const server = app.listen(config.PORT, async () => {
      logger.info(`HTTP server listening on port ${config.PORT}`);
      try {
        const fullWebhookUrl = `${config.WEBHOOK_URL.replace(/\/$/, '')}${webhookPath}`;
        await bot.telegram.setWebhook(fullWebhookUrl);
        logger.info(`Webhook set: ${fullWebhookUrl}`);
      } catch (err) {
        logger.error('Failed to set webhook:', err.message);
      }
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received, shutting down...`);
      server.close();
      try {
        await bot.telegram.deleteWebhook();
      } catch (err) {
        logger.warn('deleteWebhook on shutdown failed:', err.message);
      }
      process.exit(0);
    };
    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  } else {
    // ------------------------------------------------------------------
    // LOCAL DEV MODE: long polling, no public URL needed
    // ------------------------------------------------------------------
    logger.info('WEBHOOK_URL not set — starting in long-polling mode (local dev).');
    await bot.telegram.deleteWebhook().catch(() => {});
    await bot.launch();
    logger.info('Bot launched with long polling.');

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }
}

start().catch((err) => {
  logger.error('Fatal startup error:', err);
  process.exit(1);
});
