const { Scenes } = require('telegraf');
const { t, tWithHandle } = require('../i18n');
const { renderScreen } = require('../screen');
const { cancelKeyboard, mainMenuKeyboard } = require('../keyboards');
const { forwardTicketToAdmin } = require('../adminForward');
const logger = require('../logger');

/** Step 0: ask for a screenshot of the pending withdrawal */
async function stepAskScreenshot(ctx) {
  const lang = ctx.session.lang || 'en';
  ctx.wizard.state.ticket = { type: 'withdrawal', from: ctx.from };
  await renderScreen(ctx, t(lang, 'withdrawal_ask_screenshot'), cancelKeyboard(lang));
  return ctx.wizard.next();
}

/** Step 1: receive the screenshot, forward ticket, confirm to user */
async function stepReceiveScreenshot(ctx) {
  const lang = ctx.session.lang || 'en';

  if (ctx.updateType === 'callback_query') return;

  if (!ctx.message?.photo?.length) {
    await ctx.reply(t(lang, 'withdrawal_ask_screenshot_invalid'));
    return; // stay on this step
  }

  const bestPhoto = ctx.message.photo[ctx.message.photo.length - 1];
  ctx.wizard.state.ticket.screenshotFileId = bestPhoto.file_id;

  const ticket = ctx.wizard.state.ticket;
  const delivered = await forwardTicketToAdmin(ctx.telegram, ticket);

  if (!delivered) {
    logger.warn('Withdrawal ticket admin forward failed for user', ctx.from.id);
  }

  await renderScreen(ctx, tWithHandle(lang, 'withdrawal_submitted'), mainMenuKeyboard(lang));
  return ctx.scene.leave();
}

const withdrawalScene = new Scenes.WizardScene(
  'WITHDRAWAL_SCENE',
  stepAskScreenshot,
  stepReceiveScreenshot
);

// Cancel button is available on every step of this flow.
withdrawalScene.action('flow:cancel', async (ctx) => {
  const lang = ctx.session.lang || 'en';
  await ctx.answerCbQuery().catch(() => {});
  await renderScreen(ctx, t(lang, 'flow_cancelled'), mainMenuKeyboard(lang));
  return ctx.scene.leave();
});

module.exports = withdrawalScene;
