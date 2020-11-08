import { BaseCommand } from '../basecommand';
import { elapsed } from '../../utils';
import { Context } from 'detritus-client/lib/command';

export default class UptimeCommand extends BaseCommand {

    name = 'uptime'

    metadata = {
      description: 'Get the bot uptime'
    }

    async run (context: Context) {
        const uptime = process.uptime();
        const elapsedUptime = elapsed(uptime * 1000);
        const formattedUptime = `${elapsedUptime.days}d ${elapsedUptime.hours}h ${elapsedUptime.minutes}m ${elapsedUptime.seconds}s`
        return context.editOrReply(`Process uptime: ${formattedUptime}`)
    }
}
