import { BaseCommand } from '../basecommand';
import { Context } from 'detritus-client/lib/command';

export default class PingCommand extends BaseCommand {
    aliases = ['pong']

    name = 'ping'

    metadata = {
      description: 'Ping the Discord REST and WebSocket APIs'
    }

    async run (context: Context) {
      const { gateway, rest } = await context.client.ping();

      return context.editOrReply(`Pong! REST: ${rest}ms, WebSocket: ${gateway}ms`);
    }
}
