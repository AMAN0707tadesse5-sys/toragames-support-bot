# toragames.com Support Bot

Production-ready, asynchronous Telegram support bot for **toragames.com**, built with
[Telegraf](https://telegraf.js.org/) (Node.js), bilingual (English / Amharic), with
webhook support so it deploys cleanly on [Render](https://render.com).

## Features

- 🌐 English + Amharic, chosen once and remembered for the session
- 🧭 Single-message navigation — the bot edits one message's caption/keyboard instead of spamming new messages
- 💳 Deposit Support flow (phone number → transaction ID/screenshot → own-phone question → admin ticket)
- 💸 Withdrawal Support flow (screenshot → admin ticket)
- ❓ How to Play FAQ (Deposit / Withdraw / Bonus)
- 💬 Contact Support handle
- 🛠 All tickets auto-forwarded to your admin group with name, user ID, username, phone, transaction info, and screenshots
- ☁️ Webhook mode for Render (falls back to long polling automatically for local dev)

## 1. Project structure

```
toragames-support-bot/
├── index.js                 # entry point
├── src/
│   ├── config.js             # env var loading
│   ├── logger.js             # console logger
│   ├── i18n.js                # EN/AM strings + t() helper
│   ├── keyboards.js           # inline keyboard builders
│   ├── screen.js              # single-message render helper
│   ├── adminForward.js        # formats + sends tickets to ADMIN_CHAT_ID
│   ├── handlers.js            # /start, menu navigation, FAQs, contact
│   ├── bot.js                 # wires everything into the Telegraf instance
│   ├── server.js              # Express webhook server (+ polling fallback)
│   └── scenes/
│       ├── depositScene.js    # Deposit Support wizard
│       └── withdrawalScene.js # Withdrawal Support wizard
├── .env.example
├── .gitignore
└── package.json
```

## 2. Local setup

```bash
git clone <your-repo-url> toragames-support-bot
cd toragames-support-bot
npm install
cp .env.example .env
# edit .env: BOT_TOKEN, ADMIN_CHAT_ID, WELCOME_IMAGE_URL, SUPPORT_HANDLE
# leave WEBHOOK_URL empty for local dev
npm start
```

With `WEBHOOK_URL` empty, the bot automatically runs in **long-polling mode** —
no public URL or tunnel needed for local testing.

### Getting your `ADMIN_CHAT_ID`

1. Create a Telegram group (or channel) for support tickets.
2. Add your bot to it as a member (and admin, if it's a channel/broadcast group).
3. Send any message in the group, then visit:
   `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
4. Find `"chat":{"id": -100xxxxxxxxxx, ...}` — that's your `ADMIN_CHAT_ID` (group IDs are negative).

## 3. Push to GitHub

```bash
cd toragames-support-bot
git init
git add .
git commit -m "Initial commit: toragames.com support bot"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env` is already gitignored — never commit your real bot token.

## 4. Deploy on Render (webhook mode)

1. On [render.com](https://render.com), click **New → Web Service** and connect your GitHub repo.
2. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid, for no cold starts)
3. Add environment variables under **Environment**:
   | Key | Value |
   |---|---|
   | `BOT_TOKEN` | your bot token from @BotFather |
   | `ADMIN_CHAT_ID` | your admin group chat id |
   | `WELCOME_IMAGE_URL` | your banner image URL |
   | `SUPPORT_HANDLE` | `@toragames_support` |
   | `WEBHOOK_URL` | `https://<your-service-name>.onrender.com` (fill in **after** first deploy, once Render gives you the URL) |
   | `WEBHOOK_SECRET_PATH` | a random string — generate with `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"` |
   | `NODE_ENV` | `production` |
4. Deploy. Render builds and starts the service; watch the logs for:
   ```
   HTTP server listening on port 10000
   Webhook set: https://<your-service-name>.onrender.com/webhook/<secret>
   ```
5. Message your bot on Telegram — it should respond immediately.

**Note on `PORT`:** don't set it manually — Render injects `PORT` automatically and the app reads `process.env.PORT`.

### Free tier behavior

Render's free web services sleep after ~15 minutes of no HTTP traffic. Telegram
will retry a webhook delivery for a while, so the first message after idle time
may arrive with a delay (cold start, usually well under a minute) instead of
being lost. If you need zero-delay responses at all times, upgrade to a paid
Render instance, or set up an external uptime pinger (e.g. cron-job.org hitting
`GET /` every 10 minutes) to keep the service warm.

## 5. Customizing

- **Copy/translations**: edit `src/i18n.js` — every string lives there, in both `en` and `am`.
- **Add a language**: add a new top-level key to `STRINGS` in `i18n.js` mirroring every key from `en`, then add a button for it in `languageKeyboard()` in `keyboards.js` and extend the `/^lang:(en|am)$/` regex in `bot.js`.
- **Add another support flow**: copy `src/scenes/depositScene.js` as a template for a new `Scenes.WizardScene`, register it in the `stage` array in `bot.js`, and add a menu button + `bot.action(...)` entry point.
- **Persistent sessions across restarts**: swap `session()` in `bot.js` for a persistent store, e.g. `telegraf-session-local` (file-based) or a Redis-backed session store, if you need language choice / in-progress flows to survive a redeploy.

## 6. Admin ticket format

Tickets are always sent to `ADMIN_CHAT_ID` in English for consistency, formatted as:

```
🆕 DEPOSIT SUPPORT TICKET
Name: <first + last name>
User ID: <telegram numeric id>
Username: @<telegram username or —>
Phone: <submitted phone number>
Transaction ID: <submitted id, or — if screenshot only>
Paid with own phone?: Yes/No
Screenshot: Attached below ⬇️ / Not provided
```

If a screenshot was submitted, it's sent as a photo with the above as its caption.
