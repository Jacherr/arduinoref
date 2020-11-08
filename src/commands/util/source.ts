import { BaseCommand } from '../basecommand';
import { Context } from 'detritus-client/lib/command';

export default class SourceCommand extends BaseCommand {

    name = 'source'

    metadata = {
      description: 'Get the bot source code link'
    }

    async run (context: Context) {
        return context.editOrReply('<https://github.com/Jacherr/arduinoref>')
    }
}
