const config = require('./config');
const logger = require('./logger');
const { t } = require('./i18n');

/**
 * Builds the admin-facing ticket text. Admin messages are always in English
 * regardless of the user's chosen language, so the ops team has one consistent format.
 */
function buildTicketText({ headerKey, from, phone, txnId, ownPhone, screenshot }) {
  const lines = [t('en', headerKey)];

  const fullName = [from.first_name, from.last_name].filter(Boolean).join(' ') || '—';
  lines.push(`${t('en', 'admin_field_name')}: ${fullName}`);
  lines.push(`${t('en', 'admin_field_user_id')}: \`${from.id}\``);
  lines.push(`${t('en', 'admin_field_username')}: ${from.username ? '@' + from.username : '—'}`);

  if (phone !== undefined) {
    lines.push(`${t('en', 'admin_field_phone')}: ${phone}`);
  }
  if (txnId !== undefined) {
    lines.push(`${t('en', 'admin_field_txn')}: ${txnId || '—'}`);
  }
  if (ownPhone !== undefined) {
    lines.push(`${t('en', 'admin_field_own_phone')}: ${ownPhone}`);
  }
  lines.push(
    `${t('en', 'admin_field_screenshot')}: ${
      screenshot
        ? t('en', 'admin_field_screenshot_attached')
        : t('en', 'admin_field_screenshot_none')
    }`
  );

  return lines.join('\n');
}

/**
 * Sends a formatted ticket (+ optional screenshot) to ADMIN_CHAT_ID.
 * Wrapped in try/catch so a Telegram/network hiccup never crashes the bot
 * or blocks the user-facing confirmation message.
 *
 * @param {import('telegraf').Telegram} telegram
 * @param {object} ticket
 * @param {'deposit'|'withdrawal'} ticket.type
 * @param {import('telegraf/typings/core/types/typegram').User} ticket.from
 * @param {string} [ticket.phone]
 * @param {string} [ticket.txnId]
 * @param {string} [ticket.ownPhone]
 * @param {string} [ticket.screenshotFileId] - Telegram file_id of a photo, if provided
 * @returns {Promise<boolean>} true if delivered successfully
 */
async function forwardTicketToAdmin(telegram, ticket) {
  const headerKey =
    ticket.type === 'deposit' ? 'admin_ticket_header_deposit' : 'admin_ticket_header_withdrawal';

  const text = buildTicketText({
    headerKey,
    from: ticket.from,
    phone: ticket.phone,
    txnId: ticket.txnId,
    ownPhone: ticket.ownPhone,
    screenshot: Boolean(ticket.screenshotFileId),
  });

  try {
    if (ticket.screenshotFileId) {
      await telegram.sendPhoto(config.ADMIN_CHAT_ID, ticket.screenshotFileId, {
        caption: text,
        parse_mode: 'Markdown',
      });
    } else {
      await telegram.sendMessage(config.ADMIN_CHAT_ID, text, { parse_mode: 'Markdown' });
    }
    return true;
  } catch (err) {
    logger.error('forwardTicketToAdmin failed:', err?.response?.description || err.message);
    return false;
  }
}

module.exports = { forwardTicketToAdmin };
