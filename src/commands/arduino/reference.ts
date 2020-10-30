/* eslint-disable no-eval */
import { Command } from 'detritus-client';

import { searchReference } from '../../ref';
import { BaseCommand } from '../basecommand';
import { EmbedColors } from '../../constants';

export interface CommandArgs {
  query: string
}

const fieldKeys = [
    'parameters',
    'returns',
    'syntax'
];

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

    const pages = result.map((x) => {
        const fields: {
            name: string,
            value: string,
            inline?: boolean
        }[] = [{
            name: 'Link',
            value: x.objectID
        }].concat(
            fieldKeys
                .map((key) => ({
                    name: key,
                    value: x[key] as string
                }))
                // Some fields might have empty strings, so we filter those out
                .filter(x => x.value)
        );

        return {
            embed: {
                author: {
                    iconUrl: 'http://siminnovations.com/wiki/images/7/7a/Arduino_logo_round.png',
                    name: x.breadcrumbs,
                },
                title: x.title,
                description: x.description,
                color: EmbedColors.ARDUINO,
                fields
            }
        };
    });

    await this.arduino.paginator.createReactionPaginator({
        message: context.message,
        pages
    });
  }
}
