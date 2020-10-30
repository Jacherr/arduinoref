import { ArduinoBot } from "./bot";

import { token } from '../config.json'

const bot = new ArduinoBot(token, {
    directory: './commands',
    gateway: {
        intents: ['GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
        presence: {
            game: {
                name: '-help',
                type: 0
            }
        }
    }
});

(async () => {
    await bot.run();
    console.log('Online');
})();