const logger = require('./logger');

/**
 * All bot navigation happens on ONE anchor message (the /start banner photo).
 * We track its chat_id/message_id in session and always try to edit its
 * caption + keyboard instead of sending new messages, per the single-message
 * UX requirement. If the edit fails (message too old / deleted / not modified),
 * we transparently fall back to sending a fresh message and re-anchoring.
 *
 * @param {import('telegraf').Context} ctx
 * @param {string} caption
 * @param {import('telegraf').Markup.Markup<any>} [keyboard]
 */
async function renderScreen(ctx, caption, keyboard) {
  const session = ctx.session || (ctx.session = {});
  const extra = {
    parse_mode: 'Markdown',
    ...(keyboard ? keyboard : {}),
  };

  const anchorChatId = session.anchorChatId;
  const anchorMessageId = session.anchorMessageId;

  if (anchorChatId && anchorMessageId) {
    try {
      await ctx.telegram.editMessageCaption(
        anchorChatId,
        anchorMessageId,
        undefined,
        caption,
        extra
      );
      return;
    } catch (err) {
      // "message is not modified" is harmless (same content re-rendered).
      const desc = err?.response?.description || err.message || '';
      if (desc.includes('message is not modified')) return;
      logger.warn('renderScreen: edit failed, falling back to new message:', desc);
    }
  }

  // Fallback: no anchor yet, or edit failed -> send a plain text message
  // and remember it as the new anchor for future navigation.
  const sent = await ctx.reply(caption, extra);
  session.anchorChatId = sent.chat.id;
  session.anchorMessageId = sent.message_id;
}

/**
 * Sends the initial banner photo (used only by /start) and stores it as the
 * anchor message for all subsequent renderScreen() calls.
 */
async function renderBanner(ctx, imageUrl, caption, keyboard) {
  const session = ctx.session || (ctx.session = {});
  const sent = await ctx.replyWithPhoto(imageUrl, {
    caption,
    parse_mode: 'Markdown',
    ...(keyboard ? keyboard : {}),
  });
  session.anchorChatId = sent.chat.id;
  session.anchorMessageId = sent.message_id;
}

module.exports = { renderScreen, renderBanner };
