# TeleBot bootstrap for Vercel

A simple bootstrap for [TeleBot](https://github.com/mullwar/telebot) that will help you quickly develop or migrate
your [Telegram](https://telegram.org) bot
to [Vercel](https://vercel.com)

**This package supports only webhooks !**

## How to use

Webhook receiver function:

```js
import TeleBot from "telebot"
import {start} from "telebot-vercel"

const bot = new TeleBot(/* TELEGRAM_BOT_TOKEN */)

bot.on('text', msg => msg.reply.text(msg.text))

export default start(bot) // Instead of bot.start()
```

Webhook setup function:

```js
import TeleBot from "telebot"
import {setWebhook} from 'telebot-vercel'

const bot = new TeleBot(/* TELEGRAM_BOT_TOKEN */)

const path = 'api/webhook.mjs' // Receiver function path

export default setWebhook(bot, path) // Instead of bot.setWebhook()
```

If you use plugins (including built-in ones), then you need to import them manually:

```js
import TeleBot from "telebot"

import "telebot/plugins/shortReply.js"
import "telebot/plugins/regExpMessage.js"
```

... or specify them in [vercel.json](https://vercel.com/docs/project-configuration#project-configuration/functions):

```json
{
  "functions": {
    "api/**": {
      "includeFiles": "node_modules/telebot/plugins/**"
    }
  }
}
```

### [Complete usage example](https://github.com/PonomareVlad/TeleVercelBot)
