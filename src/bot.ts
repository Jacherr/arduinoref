import { CommandClient, CommandClientOptions, CommandClientRunOptions, ShardClient } from 'detritus-client';
import { Context, Command } from 'detritus-client/lib/command';
import { Paginator } from 'detritus-pagination';

export interface ArduinoOptions extends CommandClientOptions {
  directory: string
}

export class ArduinoBot extends CommandClient {
  public client!: ShardClient
  public directory: string
  public paginator: Paginator;

  constructor (token: string, options: ArduinoOptions) {
    super(token, {
        useClusterClient: false,
        ...options
    });

    this.directory = options.directory;
    this.paginator = new Paginator(this.client, {
      maxTime: 300_000,
      pageLoop: true,
      pageNumber: true
    });
  }

  async resetCommands () {
    this.clear();
    await this.addMultipleIn(this.directory, {
      subdirectories: true
    });
  }

  async run (options?: CommandClientRunOptions) {
    await this.resetCommands();
    return super.run(options);
  }

  onPrefixCheck(context: Context) {
    const userId = context.client.userId;
    return new Set(['-', `<@${userId}>`, `<@!${userId}>`]);
  }
}
