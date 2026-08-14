const { Telegraf, Scenes, session } = require('telegraf');
const config = require('./config');
const logger = require('./logger');
const { t } = require('./i18n');
const handlers = require('./handlers');
const depositScene = require('./scenes/depositScene');
const withdrawalScene = require('./scenes/withdrawalScene');

const bot = new Telegraf(config.BOT_TOKEN);

// --- Session (in-memory by default) ---------------------------------------
// NOTE: this default in-memory store resets on every deploy/restart, which is
// fine for Render's free tier (short-lived sessions). For persistence across
// restarts, swap this for a store like `telegraf-session-local` or Redis —
// see README.md.
bot.use(session());

// --- Scenes (multi-step Deposit / Withdrawal flows) ------------------------
const stage = new Scenes.Stage([depositScene, withdrawalScene]);
bot.use(stage.middleware());

// --- Commands ---------------------------------------------------------------
bot.start(handlers.handleStart);

bot.command('menu', async (ctx) => {
  if (!ctx.session?.lang) return handlers.handleStart(ctx);
  return handlers.handleMainMenu(ctx);
});

bot.command('cancel', async (ctx) => {
  if (ctx.scene?.current) await ctx.scene.leave();
  return handlers.handleMainMenu(ctx);
});

// --- Language selection -------------------------------------------------
bot.action(/^lang:(en|am)$/, handlers.handleLanguageSelect);

// --- Main menu navigation ---------------------------------------------------
bot.action('menu:main', handlers.handleMainMenu);
bot.action('menu:deposit', handlers.handleDepositMenu);
bot.action('menu:withdrawal', handlers.handleWithdrawalMenu);
bot.action('menu:how_to_play', handlers.handleHowToPlayMenu);
bot.action('menu:contact', handlers.handleContact);

// --- How to Play FAQ detail pages ------------------------------------------
bot.action(/^faq:(deposit|withdraw|bonus)$/, handlers.handleFaqDetail);

// --- Enter conversation flows ------------------------------------------
bot.action('deposit:start', (ctx) => ctx.scene.enter('DEPOSIT_SCENE'));
bot.action('withdrawal:start', (ctx) => ctx.scene.enter('WITHDRAWAL_SCENE'));

// --- Fallback for plain text/photos sent outside any flow -------------------
bot.on('message', async (ctx) => {
  const lang = ctx.session?.lang || 'en';
  if (!ctx.session?.lang) {
    return handlers.handleStart(ctx);
  }
  await ctx.reply(t(lang, 'session_expired'));
});

// --- Global error handler ---------------------------------------------------
// Ensures a single bad update never crashes the whole bot process.
bot.catch((err, ctx) => {
  logger.error(`Unhandled error for update ${ctx.updateType}:`, err);
  ctx.reply(t(ctx.session?.lang || 'en', 'generic_error', { handle: config.SUPPORT_HANDLE })).catch(
    () => {}
  );
});

module.exports = bot;
