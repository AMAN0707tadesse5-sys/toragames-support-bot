require('dotenv').config();

/**
 * Reads a required env var and throws a clear startup error if it's missing.
 * @param {string} name
 * @param {{required?: boolean, fallback?: string}} opts
 */
function env(name, { required = false, fallback = undefined } = {}) {
  const value = process.env[name];
  if ((value === undefined || value === '') && required) {
    throw new Error(`[config] Missing required environment variable: ${name}`);
  }
  return value === undefined || value === '' ? fallback : value;
}

const config = {
  BOT_TOKEN: env('BOT_TOKEN', { required: true }),
  ADMIN_CHAT_ID: env('ADMIN_CHAT_ID', { required: true }),
  WELCOME_IMAGE_URL: env('WELCOME_IMAGE_URL', {
    fallback: 'https://placehold.co/1200x630/1a1a2e/ffd60a?text=toragames.com',
  }),
  SUPPORT_HANDLE: env('SUPPORT_HANDLE', { fallback: '@toragames_support' }),

  // Webhook config (Render). If WEBHOOK_URL is empty, index.js falls back to polling.
  WEBHOOK_URL: env('WEBHOOK_URL', { fallback: '' }),
  WEBHOOK_SECRET_PATH: env('WEBHOOK_SECRET_PATH', { fallback: 'telegraf-webhook' }),
  PORT: parseInt(env('PORT', { fallback: '3000' }), 10),

  NODE_ENV: env('NODE_ENV', { fallback: 'development' }),
};

module.exports = config;
