const config = require('./config');
const { t, tWithHandle } = require('./i18n');
const { renderScreen, renderBanner } = require('./screen');
const {
  languageKeyboard,
  mainMenuKeyboard,
  depositMenuKeyboard,
  withdrawalMenuKeyboard,
  howToPlayKeyboard,
  backKeyboard,
} = require('./keyboards');
const logger = require('./logger');

/** /start — send banner + language picker, resetting any prior session state */
async function handleStart(ctx) {
  ctx.session = { lang: ctx.session?.lang }; // keep previously chosen language if any
  const lang = ctx.session.lang;

  try {
    await renderBanner(
      ctx,
      config.WELCOME_IMAGE_URL,
      lang ? t(lang, 'main_menu_title') : t('en', 'welcome_caption'),
      lang ? mainMenuKeyboard(lang) : languageKeyboard()
    );
  } catch (err) {
    logger.error('handleStart failed:', err.message);
    await ctx.reply(t('en', 'generic_error', { handle: config.SUPPORT_HANDLE })).catch(() => {});
  }
}

/** Language selection: lang:en | lang:am */
async function handleLanguageSelect(ctx) {
  const lang = ctx.match[1];
  ctx.session.lang = lang;
  await ctx.answerCbQuery().catch(() => {});
  await renderScreen(ctx, t(lang, 'main_menu_title'), mainMenuKeyboard(lang));
}

/** menu:main — return to main menu from anywhere */
async function handleMainMenu(ctx) {
  const lang = ctx.session.lang || 'en';
  await ctx.answerCbQuery().catch(() => {});
  await renderScreen(ctx, t(lang, 'main_menu_title'), mainMenuKeyboard(lang));
}

/** menu:deposit — deposit submenu */
async function handleDepositMenu(ctx) {
  const lang = ctx.session.lang || 'en';
  await ctx.answerCbQuery().catch(() => {});
  await renderScreen(ctx, t(lang, 'deposit_menu_title'), depositMenuKeyboard(lang));
}

/** menu:withdrawal — withdrawal submenu */
async function handleWithdrawalMenu(ctx) {
  const lang = ctx.session.lang || 'en';
  await ctx.answerCbQuery().catch(() => {});
  await renderScreen(ctx, t(lang, 'withdrawal_menu_title'), withdrawalMenuKeyboard(lang));
}

/** menu:how_to_play — FAQ menu */
async function handleHowToPlayMenu(ctx) {
  const lang = ctx.session.lang || 'en';
  await ctx.answerCbQuery().catch(() => {});
  await renderScreen(ctx, t(lang, 'how_to_play_title'), howToPlayKeyboard(lang));
}

/** faq:deposit | faq:withdraw | faq:bonus — FAQ detail pages */
async function handleFaqDetail(ctx) {
  const lang = ctx.session.lang || 'en';
  const topic = ctx.match[1]; // deposit | withdraw | bonus
  const keyMap = {
    deposit: 'faq_how_deposit',
    withdraw: 'faq_how_withdraw',
    bonus: 'faq_how_bonus',
  };
  await ctx.answerCbQuery().catch(() => {});
  await renderScreen(ctx, t(lang, keyMap[topic]), backKeyboard(lang, 'menu:how_to_play'));
}

/** menu:contact — contact support info */
async function handleContact(ctx) {
  const lang = ctx.session.lang || 'en';
  await ctx.answerCbQuery().catch(() => {});
  await renderScreen(ctx, tWithHandle(lang, 'contact_title'), backKeyboard(lang, 'menu:main'));
}

module.exports = {
  handleStart,
  handleLanguageSelect,
  handleMainMenu,
  handleDepositMenu,
  handleWithdrawalMenu,
  handleHowToPlayMenu,
  handleFaqDetail,
  handleContact,
};
