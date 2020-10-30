/* eslint-disable no-eval */
import { Command } from 'detritus-client';

import { searchReference } from '../../ref';
import { BaseCommand } from '../basecommand';
import { EmbedColors } from '../../constants';

export interface CommandArgs {
  query: string
}

export default class ReferenceCommand extends BaseCommand {
  name = 'reference'

  label = 'query'

  metadata = {
    description: 'Fetch Arduino reference for an individual entry',
    examples: ['Serial'],
    usage: '[function or object]'
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

    const firstEntry = result[0];
    const fields: {
        name: string,
        value: string,
        inline?: boolean
    }[] = [{
        name: 'Link',
        value: firstEntry.objectID
    }];

    if(firstEntry.parameters) fields.push({
        name: 'Parameters',
        value: firstEntry.parameters,
        inline: true
    })

    if(firstEntry.returns) fields.push({
        name: 'Returns',
        value: firstEntry.returns,
        inline: true
    })

    if(firstEntry.syntax) fields.push({
        name: 'Syntax',
        value: firstEntry.syntax,
        inline: true
    })

    return context.editOrReply({
        embed: {
            author: {
                iconUrl: 'http://siminnovations.com/wiki/images/7/7a/Arduino_logo_round.png',
                name: firstEntry.breadcrumbs,
            },
            title: firstEntry.title,
            description: firstEntry.description,
            color: EmbedColors.ARDUINO,
            fields
        }
    })
  }
}
