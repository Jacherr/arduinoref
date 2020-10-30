import { ArduinoBot } from "./bot";

import { token } from '../config.json'

const bot = new ArduinoBot(token, {
    directory: './commands',
    gateway: {
        intents: ['GUILD_MESSAGES']
    }
});

(async () => {
    await bot.run();
    console.log('Online');
})();