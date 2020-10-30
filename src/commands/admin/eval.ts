/* eslint-disable no-eval */
import { Command } from 'detritus-client';
import { Markup } from 'detritus-client/lib/utils';
import { inspect } from 'util';

import { BaseAdminCommand } from '../baseadmincommand';
import { parseCodeblocks } from '../../utils';

export interface CommandArgs {
  code: string,
  noreply: boolean,
  depth: number,
  attach: boolean,
  async: boolean
}

export default class EvalCommand extends BaseAdminCommand {
  //@ts-ignore
  args = [
    {
      name: 'async',
      type: Boolean,
      default: false
    },
    {
      name: 'attach',
      type: Boolean,
      default: false
    },
    {
      name: 'depth',
      default: '0',
      type: Number
    },
    {
      name: 'noreply',
      type: Boolean,
      default: false
    }
  ]

  label = 'code'

  name = 'e'

  metadata = {
    description: 'Evaluate JavaScript',
    examples: ['1+1'],
    usage: '[code]'
  }

  async run(context: Command.Context, args: CommandArgs) {
    let evaled: any;
    const code = parseCodeblocks(args.code);

    try {
      if (!args.async) {
        evaled = await Promise.resolve(eval(code));
      } else {
        evaled = await Promise.resolve(eval(`(async () => {\n${code}\n})()`));
      }
    } catch (e) {
      return context.editOrReply(Markup.codeblock(e.message || e.stack || e.toString(), { limit: 1990, language: 'js' }));
    }

    if (args.attach && !args.noreply) {
      let extension = 'txt';

      if (Buffer.isBuffer(evaled)) extension = 'png';
      else if (typeof evaled === 'object') {
        evaled = inspect(evaled, { depth: args.depth, showHidden: true });
      } else {
        evaled = String(evaled);
      }

      return context.editOrReply({ file: { value: evaled, filename: `eval.${extension}` } });
    } else if (!args.noreply) {
      if (typeof evaled === 'object') {
        evaled = inspect(evaled, { depth: args.depth, showHidden: true });
      } else {
        evaled = String(evaled);
      }

      return context.editOrReply(Markup.codeblock(evaled, {
        language: 'js',
        limit: 1990
      }));
    }
  }
}
