import { CommandClient, CommandClientOptions, CommandClientRunOptions, ShardClient } from 'detritus-client';
import { Context, Command } from 'detritus-client/lib/command';

export interface ArduinoOptions extends CommandClientOptions {
  directory: string
}

export class ArduinoBot extends CommandClient {
  public client!: ShardClient
  public directory: string

  constructor (token: string, options: ArduinoOptions) {
    super(token, {
        useClusterClient: false,
        ...options
    });

    this.directory = options.directory;
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
