/* eslint-disable no-eval */
import { Command } from 'detritus-client';
import { exec } from 'child_process';
import { writeFile } from 'fs'

import { searchReference } from '../../ref';
import { BaseCommand } from '../basecommand';
import { EmbedColors } from '../../constants';
import { parseCodeblocks } from '../../utils';
import { Markup } from 'detritus-client/lib/utils';
import { convertKey } from 'detritus-client/lib/structures';

export interface CommandArgs {
    code: string
}

export default class CompileCommand extends BaseCommand {
    activeExecutions = new Set<string>()

    name = 'compile'

    label = 'code'

    metadata = {
        description: 'Compile Arduino code to check it is valid',
        examples: ['void setup() {}\n\nvoid loop() {}'],
        usage: '[code]'
    }

    async run(context: Command.Context, args: CommandArgs) {
        if (!args.code) {
            return this.error(context, 'Provide some code.')
        } else if (this.activeExecutions.has(context.userId)) {
            return this.error(context, 'You already have a sketch compiling.')
        } else if (args.code.split(' ').join('').includes('#include')) {
            return this.error(context, 'Importing files is disabled.')
        }

        await context.triggerTyping();

        this.activeExecutions.add(context.userId);
        const res = await this.compileSketch(context.userId, parseCodeblocks(args.code));
        this.activeExecutions.delete(context.userId);
        if (!res.success) {
            // this parse removes the 'command failed:' line, for a cleaner error output
            const splitMessage = res.message.split('\n');
            const message = splitMessage.length > 1 ? splitMessage.slice(1).join('\n') : splitMessage.join('\n');
            return this.error(context, Markup.codeblock(Markup.escape.codeblock(message)))
        }
        return context.editOrReply(`Success:\n${Markup.codeblock(res.message)}`)
    }

    async compileSketch(userId: string, code: string): Promise<{ success: boolean, message: string }> {
        const newSketchCommand = `arduino-cli sketch new ${userId}`;
        const compileCommand = `arduino-cli compile --fqbn arduino:samd:mkr1000 ${userId}`;

        let compileResult: string;

        await this.exec(newSketchCommand);
        await this.writeToSketchFile(userId, code);
        try {
            compileResult = await this.exec(compileCommand);
        } catch (err) {
            this.deleteSketch(userId);
            return {
                success: false,
                message: err
            }
        }
        this.deleteSketch(userId);
        return {
            success: true,
            message: compileResult
        }
    }

    async exec(script: string, timeout?: number): Promise<string> {
        const execTimeout = timeout || 5000;
        return Promise.race([
            new Promise((resolve, reject) => {
                exec(script, { timeout: execTimeout + 500 }, (error, stdout, stderr) => {
                    if (error) reject(error.message);
                    if (stderr) reject(stderr);
                    resolve(stdout);
                })
            }) as Promise<string>,
            new Promise((_, reject) => {
                setTimeout(() => reject(`timeout after ${execTimeout}ms`), execTimeout)
            }) as Promise<string>
        ])
    }

    async writeToSketchFile(userId: string, code: string) {
        return new Promise((resolve, reject) => {
            writeFile(`./${userId}/${userId}.ino`, code, {}, (err) => {
                if (err) reject(err.message);
                resolve();
            })
        })
    }

    async deleteSketch(userId: string) {
        const deleteSketchCommand = `rm -rf ./${userId}`;
        return await this.exec(deleteSketchCommand);
    }
}
