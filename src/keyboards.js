const { Markup } = require('telegraf');
const { t } = require('./i18n');

/** Language selection keyboard shown on /start */
function languageKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🇬🇧 English', 'lang:en'),
      Markup.button.callback('🇪🇹 አማርኛ', 'lang:am'),
    ],
  ]);
}

/** Main menu keyboard */
function mainMenuKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_deposit'), 'menu:deposit')],
    [Markup.button.callback(t(lang, 'btn_withdrawal'), 'menu:withdrawal')],
    [Markup.button.callback(t(lang, 'btn_how_to_play'), 'menu:how_to_play')],
    [Markup.button.callback(t(lang, 'btn_contact'), 'menu:contact')],
  ]);
}

/** Deposit submenu */
function depositMenuKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_deposit_pending'), 'deposit:start')],
    [Markup.button.callback(t(lang, 'btn_main_menu'), 'menu:main')],
  ]);
}

/** Withdrawal submenu */
function withdrawalMenuKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_withdraw_slow'), 'withdrawal:start')],
    [Markup.button.callback(t(lang, 'btn_main_menu'), 'menu:main')],
  ]);
}

/** How to play FAQ menu */
function howToPlayKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_how_deposit'), 'faq:deposit')],
    [Markup.button.callback(t(lang, 'btn_how_withdraw'), 'faq:withdraw')],
    [Markup.button.callback(t(lang, 'btn_how_bonus'), 'faq:bonus')],
    [Markup.button.callback(t(lang, 'btn_main_menu'), 'menu:main')],
  ]);
}

/** Generic "back" keyboard used on FAQ detail pages / contact page */
function backKeyboard(lang, target = 'menu:how_to_play') {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_back'), target)],
    [Markup.button.callback(t(lang, 'btn_main_menu'), 'menu:main')],
  ]);
}

/** Yes/No inline keyboard used in the deposit flow */
function yesNoKeyboard(lang) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(t(lang, 'btn_yes'), 'deposit:own_phone:yes'),
      Markup.button.callback(t(lang, 'btn_no'), 'deposit:own_phone:no'),
    ],
  ]);
}

/** Single cancel button shown mid-flow (deposit/withdrawal steps) */
function cancelKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_cancel'), 'flow:cancel')],
  ]);
}

module.exports = {
  languageKeyboard,
  mainMenuKeyboard,
  depositMenuKeyboard,
  withdrawalMenuKeyboard,
  howToPlayKeyboard,
  backKeyboard,
  yesNoKeyboard,
  cancelKeyboard,
};
