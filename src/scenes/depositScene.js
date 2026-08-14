const { Scenes } = require('telegraf');
const { t, tWithHandle } = require('../i18n');
const { renderScreen } = require('../screen');
const { cancelKeyboard, yesNoKeyboard, mainMenuKeyboard } = require('../keyboards');
const { forwardTicketToAdmin } = require('../adminForward');
const logger = require('../logger');

const PHONE_RE = /^[0-9+()\-\s]{7,15}$/;

/** Step 0: ask for phone number */
async function stepAskPhone(ctx) {
  const lang = ctx.session.lang || 'en';
  ctx.wizard.state.ticket = { type: 'deposit', from: ctx.from };
  await renderScreen(ctx, t(lang, 'deposit_ask_phone'), cancelKeyboard(lang));
  return ctx.wizard.next();
}

/** Step 1: receive phone number, ask for txn id / screenshot */
async function stepReceivePhone(ctx) {
  const lang = ctx.session.lang || 'en';

  if (ctx.updateType === 'callback_query') {
    // e.g. Cancel button — handled globally, but guard just in case.
    return;
  }

  const phone = ctx.message?.text?.trim();
  if (!phone || !PHONE_RE.test(phone)) {
    await ctx.reply(t(lang, 'deposit_ask_phone_invalid'));
    return; // stay on this step
  }

  ctx.wizard.state.ticket.phone = phone;
  await renderScreen(ctx, t(lang, 'deposit_ask_txn'), cancelKeyboard(lang));
  return ctx.wizard.next();
}

/** Step 2: receive transaction id (text) OR screenshot (photo), then ask own-phone question */
async function stepReceiveTxnOrScreenshot(ctx) {
  const lang = ctx.session.lang || 'en';

  if (ctx.updateType === 'callback_query') return;

  if (ctx.message?.photo?.length) {
    const bestPhoto = ctx.message.photo[ctx.message.photo.length - 1];
    ctx.wizard.state.ticket.screenshotFileId = bestPhoto.file_id;
    ctx.wizard.state.ticket.txnId = ctx.message.caption || undefined;
  } else if (ctx.message?.text?.trim()) {
    ctx.wizard.state.ticket.txnId = ctx.message.text.trim();
  } else {
    await ctx.reply(t(lang, 'deposit_ask_txn'));
    return; // stay on this step
  }

  await renderScreen(ctx, t(lang, 'deposit_ask_own_phone'), yesNoKeyboard(lang));
  return ctx.wizard.next();
}

/** Step 3: receive Yes/No via inline button, forward ticket, confirm to user */
async function stepReceiveOwnPhoneAnswer(ctx) {
  const lang = ctx.session.lang || 'en';

  if (ctx.updateType !== 'callback_query') {
    await renderScreen(ctx, t(lang, 'deposit_ask_own_phone'), yesNoKeyboard(lang));
    return;
  }

  const data = ctx.callbackQuery.data; // 'deposit:own_phone:yes' | '...:no'
  await ctx.answerCbQuery().catch(() => {});
  const answeredYes = data.endsWith('yes');
  ctx.wizard.state.ticket.ownPhone = answeredYes ? t('en', 'btn_yes') : t('en', 'btn_no');

  const ticket = ctx.wizard.state.ticket;
  const delivered = await forwardTicketToAdmin(ctx.telegram, ticket);

  if (!delivered) {
    logger.warn('Deposit ticket admin forward failed for user', ctx.from.id);
  }

  await renderScreen(ctx, tWithHandle(lang, 'deposit_submitted'), mainMenuKeyboard(lang));
  return ctx.scene.leave();
}

const depositScene = new Scenes.WizardScene(
  'DEPOSIT_SCENE',
  stepAskPhone,
  stepReceivePhone,
  stepReceiveTxnOrScreenshot,
  stepReceiveOwnPhoneAnswer
);

// Cancel button is available on every step of this flow.
depositScene.action('flow:cancel', async (ctx) => {
  const lang = ctx.session.lang || 'en';
  await ctx.answerCbQuery().catch(() => {});
  await renderScreen(ctx, t(lang, 'flow_cancelled'), mainMenuKeyboard(lang));
  return ctx.scene.leave();
});

module.exports = depositScene;
