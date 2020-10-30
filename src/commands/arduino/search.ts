/* eslint-disable no-eval */
import { Command } from 'detritus-client';

import { searchReference } from '../../ref';
import { BaseCommand } from '../basecommand';
import { EmbedColors } from '../../constants';

export interface CommandArgs {
  query: string
}

export default class SearchCommand extends BaseCommand {
  name = 'search'

  label = 'query'

  metadata = {
    description: 'Search Arduino reference',
    examples: ['Serial'],
    usage: '[query]'
  }

  async run(context: Command.Context, args: CommandArgs) {
    if(!args.query) {
        return this.error(context, 'Provide a search query.')
    }
    await context.triggerTyping();

    const result = await searchReference(encodeURIComponent(args.query));

    if(result.length === 0) {
        return this.error(context, 'No results found.')
    }

    const formatted = result.map((i: any) => `[${i.title}](${i.objectID})`).join('\n');

    return context.editOrReply({
        embed: {
            description: formatted,
            color: EmbedColors.ARDUINO
        }
    })
  }
}
