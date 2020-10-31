import { ArduinoBot } from "./bot";

import { token } from '../config.json'

const bot = new ArduinoBot(token, {
    directory: './commands',
    activateOnEdits: true,
    cache: {
        channels: {
            enabled: false
        },
        members: {
            enabled: false
        },
        messages: {
            limit: 1000,
            expire: 60000
        },
        users: {
            enabled: false
        }
    },
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