const config = require('./config');

/**
 * All bot copy lives here. Add more languages by adding another top-level key
 * and mirroring every string key inside `en`.
 */
const STRINGS = {
  en: {
    welcome_caption:
      'Welcome to toragames.com Support! 🎰\n\nPlease choose your language.',
    choose_language: 'Please choose your language:',
    lang_btn_en: '🇬🇧 English',
    lang_btn_am: '🇪🇹 አማርኛ',

    main_menu_title: '🎰 toragames.com Support\n\nHow can we help you today?',
    btn_deposit: '💳 Deposit Support',
    btn_withdrawal: '💸 Withdrawal Support',
    btn_how_to_play: '❓ How to Play',
    btn_contact: '💬 Contact Support',
    btn_back: '⬅️ Back',
    btn_main_menu: '⬅️ Main Menu',
    btn_cancel: '✖️ Cancel',

    // Deposit submenu
    deposit_menu_title:
      '💳 Deposit Support\n\nSelect an issue below:',
    btn_deposit_pending: 'Deposit Pending / Delayed',

    // Deposit flow
    deposit_ask_phone:
      '💳 *Deposit Pending / Delayed*\n\nPlease send the phone number linked to your toragames.com account.',
    deposit_ask_phone_invalid:
      'That doesn\'t look like a valid phone number. Please send digits only, e.g. 0912345678.',
    deposit_ask_txn:
      'Thanks! Now please send your payment *Transaction ID*, or upload a *screenshot* of the payment confirmation.',
    deposit_ask_own_phone:
      'Did you pay using your own phone number?',
    btn_yes: '✅ Yes',
    btn_no: '❌ No',
    deposit_submitted:
      '✅ Your deposit ticket has been submitted.\n\nOur admin team will review it and confirm shortly. Thank you for your patience!',

    // Withdrawal submenu
    withdrawal_menu_title:
      '💸 Withdrawal Support\n\nSelect an issue below:',
    btn_withdraw_slow: 'Withdraw Took Too Long',

    // Withdrawal flow
    withdrawal_ask_screenshot:
      '💸 *Withdraw Took Too Long*\n\nPlease upload a screenshot of your pending withdrawal request.',
    withdrawal_ask_screenshot_invalid:
      'Please send an image (screenshot) of your pending withdrawal.',
    withdrawal_submitted:
      '✅ Your withdrawal ticket has been submitted.\n\nOur admin team will review it and confirm shortly. Thank you for your patience!',

    // How to play
    how_to_play_title: '❓ How to Play\n\nChoose a topic:',
    btn_how_deposit: 'How to Deposit',
    btn_how_withdraw: 'How to Withdraw',
    btn_how_bonus: 'How to Fetch Bonus',
    faq_how_deposit:
      '💳 *How to Deposit*\n\n1. Open the toragames.com app or site and log in.\n2. Go to the *Deposit* page.\n3. Choose your payment method and enter the amount.\n4. Complete the payment using your own registered phone number.\n5. Your balance updates automatically within a few minutes.\n\nIf it doesn\'t arrive, use *Deposit Support* from the main menu.',
    faq_how_withdraw:
      '💸 *How to Withdraw*\n\n1. Open the toragames.com app or site and log in.\n2. Go to the *Withdraw* page.\n3. Enter the amount and confirm your payout details.\n4. Submit the request.\n5. Withdrawals are typically processed within a short time.\n\nIf it takes too long, use *Withdrawal Support* from the main menu.',
    faq_how_bonus:
      '🎁 *How to Fetch Bonus*\n\n1. Open the *Promotions* / *Bonus* section on toragames.com.\n2. Check the active bonus offers and their requirements.\n3. Opt in or claim the bonus as instructed.\n4. Meet any wagering requirements before withdrawing bonus funds.\n\nFor anything unclear, contact *Support*.',

    // Contact
    contact_title:
      '💬 *Contact Support*\n\nFor anything not covered here, message our support team directly:\n{handle}',

    // Cancel / errors
    flow_cancelled: 'Cancelled. Back to the main menu.',
    generic_error:
      'Something went wrong on our end. Please try again, or contact support: {handle}',
    session_expired:
      'This menu is no longer active. Please send /start to begin again.',

    // Admin ticket
    admin_ticket_header_deposit: '🆕 *DEPOSIT SUPPORT TICKET*',
    admin_ticket_header_withdrawal: '🆕 *WITHDRAWAL SUPPORT TICKET*',
    admin_field_name: 'Name',
    admin_field_user_id: 'User ID',
    admin_field_username: 'Username',
    admin_field_phone: 'Phone',
    admin_field_txn: 'Transaction ID',
    admin_field_own_phone: 'Paid with own phone?',
    admin_field_screenshot: 'Screenshot',
    admin_field_screenshot_attached: 'Attached below ⬇️',
    admin_field_screenshot_none: 'Not provided (text transaction ID given)',
  },

  am: {
    welcome_caption:
      'እንኳን ወደ toragames.com የድጋፍ መስጫ በሰላም መጡ! 🎰\n\nእባክዎ ቋንቋ ይምረጡ።',
    choose_language: 'እባክዎ ቋንቋ ይምረጡ:',
    lang_btn_en: '🇬🇧 English',
    lang_btn_am: '🇪🇹 አማርኛ',

    main_menu_title: '🎰 toragames.com ድጋፍ\n\nዛሬ እንዴት ልንረዳዎት እንችላለን?',
    btn_deposit: '💳 ገንዘብ ማስገባት ድጋፍ',
    btn_withdrawal: '💸 ገንዘብ ማውጣት ድጋፍ',
    btn_how_to_play: '❓ እንዴት መጫወት ይቻላል',
    btn_contact: '💬 ድጋፍ ለማግኘት',
    btn_back: '⬅️ ተመለስ',
    btn_main_menu: '⬅️ ዋና ማውጫ',
    btn_cancel: '✖️ ሰርዝ',

    deposit_menu_title: '💳 ገንዘብ ማስገባት ድጋፍ\n\nከታች ችግሩን ይምረጡ:',
    btn_deposit_pending: 'ገንዘብ ገብቶ አልታየኝም',

    deposit_ask_phone:
      '💳 *ገንዘብ ገብቶ አልታየኝም*\n\nእባክዎ ከ toragames.com መለያዎ ጋር የተያያዘውን ስልክ ቁጥር ይላኩ።',
    deposit_ask_phone_invalid:
      'ትክክለኛ ስልክ ቁጥር አይመስልም። እባክዎ ቁጥሮችን ብቻ ይላኩ፣ ለምሳሌ 0912345678.',
    deposit_ask_txn:
      'እናመሰግናለን! አሁን እባክዎ የክፍያ *የግብይት መለያ ቁጥር* ይላኩ፣ ወይም የክፍያ ማረጋገጫ *ስክሪንሾት* ይላኩ።',
    deposit_ask_own_phone: 'የከፈሉት በራስዎ ስልክ ቁጥር ነው?',
    btn_yes: '✅ አዎ',
    btn_no: '❌ አይ',
    deposit_submitted:
      '✅ የገንዘብ ማስገባት ጥያቄዎ ገብቷል።\n\nየድጋፍ ቡድናችን በቅርቡ ያረጋግጣል። እናመሰግናለን!',

    withdrawal_menu_title: '💸 ገንዘብ ማውጣት ድጋፍ\n\nከታች ችግሩን ይምረጡ:',
    btn_withdraw_slow: 'ገንዘብ ማውጣት ዘግይቷል',

    withdrawal_ask_screenshot:
      '💸 *ገንዘብ ማውጣት ዘግይቷል*\n\nእባክዎ ገና ያልተጠናቀቀውን የገንዘብ ማውጣት ጥያቄ ስክሪንሾት ይላኩ።',
    withdrawal_ask_screenshot_invalid:
      'እባክዎ የገንዘብ ማውጣት ጥያቄዎን ስክሪንሾት (ምስል) ይላኩ።',
    withdrawal_submitted:
      '✅ የገንዘብ ማውጣት ጥያቄዎ ገብቷል።\n\nየድጋፍ ቡድናችን በቅርቡ ያረጋግጣል። እናመሰግናለን!',

    how_to_play_title: '❓ እንዴት መጫወት ይቻላል\n\nርዕስ ይምረጡ:',
    btn_how_deposit: 'እንዴት ገንዘብ ማስገባት ይቻላል',
    btn_how_withdraw: 'እንዴት ገንዘብ ማውጣት ይቻላል',
    btn_how_bonus: 'ቦነስ እንዴት ማግኘት ይቻላል',
    faq_how_deposit:
      '💳 *እንዴት ገንዘብ ማስገባት ይቻላል*\n\n1. toragames.com መተግበሪያ ወይም ድረ-ገጽ ይክፈቱ እና ይግቡ።\n2. ወደ *ገንዘብ ማስገባት* ገጽ ይሂዱ።\n3. የክፍያ ዘዴዎን ይምረጡ እና መጠኑን ያስገቡ።\n4. በራስዎ በተመዘገበው ስልክ ቁጥር ክፍያውን ያጠናቅቁ።\n5. ቀሪ ሂሳብዎ በደቂቃዎች ውስጥ ራሱ በራሱ ይዘምናል።\n\nካልገባ፣ ከዋና ማውጫ *ገንዘብ ማስገባት ድጋፍ* ይጠቀሙ።',
    faq_how_withdraw:
      '💸 *እንዴት ገንዘብ ማውጣት ይቻላል*\n\n1. toragames.com መተግበሪያ ወይም ድረ-ገጽ ይክፈቱ እና ይግቡ።\n2. ወደ *ገንዘብ ማውጣት* ገጽ ይሂዱ።\n3. መጠኑን ያስገቡ እና የክፍያ ዝርዝሮችዎን ያረጋግጡ።\n4. ጥያቄውን ያስገቡ።\n5. የገንዘብ ማውጣት ጥያቄዎች በአጭር ጊዜ ውስጥ ይስተናገዳሉ።\n\nከዘገየ፣ ከዋና ማውጫ *ገንዘብ ማውጣት ድጋፍ* ይጠቀሙ።',
    faq_how_bonus:
      '🎁 *ቦነስ እንዴት ማግኘት ይቻላል*\n\n1. በ toragames.com ላይ *ማስተዋወቂያዎች* / *ቦነስ* ክፍልን ይክፈቱ።\n2. ያሉትን የቦነስ አቅርቦቶች እና መስፈርቶቻቸውን ይመልከቱ።\n3. እንደተጠቀሰው ቦነሱን ይመዝገቡ ወይም ይውሰዱ።\n4. ቦነስ ገንዘብን ከማውጣትዎ በፊት የውርርድ መስፈርቶችን ያሟሉ።\n\nግልጽ ላልሆነ ጉዳይ *ድጋፍ*ን ያግኙ።',

    contact_title:
      '💬 *ድጋፍ ለማግኘት*\n\nበዚህ ያልተካተተ ማንኛውም ነገር ካለ በቀጥታ የድጋፍ ቡድናችንን ያግኙ:\n{handle}',

    flow_cancelled: 'ተሰርዟል። ወደ ዋና ማውጫ ተመልሷል።',
    generic_error:
      'የሆነ ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ፣ ወይም ድጋፍን ያግኙ: {handle}',
    session_expired: 'ይህ ማውጫ ከአሁን በኋላ ንቁ አይደለም። እባክዎ /start ብለው እንደገና ይጀምሩ።',

    admin_ticket_header_deposit: '🆕 *የገንዘብ ማስገባት ድጋፍ ጥያቄ*',
    admin_ticket_header_withdrawal: '🆕 *የገንዘብ ማውጣት ድጋፍ ጥያቄ*',
    admin_field_name: 'ስም',
    admin_field_user_id: 'የተጠቃሚ መለያ',
    admin_field_username: 'የተጠቃሚ ስም',
    admin_field_phone: 'ስልክ',
    admin_field_txn: 'የግብይት መለያ ቁጥር',
    admin_field_own_phone: 'በራሱ ስልክ ተከፍሏል?',
    admin_field_screenshot: 'ስክሪንሾት',
    admin_field_screenshot_attached: 'ከታች ተያይዟል ⬇️',
    admin_field_screenshot_none: 'አልቀረበም (የግብይት መለያ ቁጥር ተሰጥቷል)',
  },
};

/**
 * Translate a key for the given language, with optional {placeholder} substitution.
 * Falls back to English, then to the raw key, so a missing string never crashes the bot.
 * @param {string} lang - 'en' | 'am'
 * @param {string} key
 * @param {Record<string,string>} [vars]
 */
function t(lang, key, vars = {}) {
  const dict = STRINGS[lang] || STRINGS.en;
  let str = dict[key] ?? STRINGS.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    str = str.replaceAll(`{${k}}`, v);
  }
  return str;
}

/** Convenience: translate using the handle configured in .env */
function tWithHandle(lang, key) {
  return t(lang, key, { handle: config.SUPPORT_HANDLE });
}

module.exports = { t, tWithHandle, STRINGS };
