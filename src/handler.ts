import { Command, CommandGroups, CommandOptions, Options } from './interfaces/command';
import { AutocompleteInteraction, CommandInteraction, Server, ServerOptions } from '@slash.js/core';

export class Handler extends Server {
    commands: Command[] = [];

    constructor(options: ServerOptions) {
        super(options);
        this.on('command', data => {
            this.handleCommand(data);
        });
        this.on('autocomplete', (data) => {
            this.handleAutocomplete(data);
        });
    }

    async handleCommand(interaction: CommandInteraction) {
        const getted = getCommand(this.commands.find(x => x.name == interaction.name)) as CommandOptions;
        const apigetted = getApiCommand(interaction.data);

        if (getted?.name == apigetted?.name) {
            if (!getted.execute) return;
            try {
                if (typeof getted.onBeforeExecute == 'function') {
                    const result = await getted.onBeforeExecute(interaction);
                    if (!result) {
                        this.emit('commandCanceled', interaction);
                        if (typeof getted.onCancelExecute == 'function') {
                            await getted.onCancelExecute(interaction);
                        }
                    } else {
                        await getted.execute(interaction);
                        return this.emit('commandExecuted', interaction);
                    }
                } else {
                    await getted.execute(interaction);
                    return this.emit('commandExecuted', interaction);
                }
            } catch (e) {
                this.emit('commandError', interaction, e);
                if (typeof getted.onErrorExecute == 'function') {
                    return await getted.onErrorExecute(interaction, e);
                }
            }
        }
    }

    handleAutocomplete(interaction: AutocompleteInteraction) {
        const getted = getCommand(this.commands.find(x => x.name == interaction.commandName));
        const apigetted = getApiCommand(interaction.data as {
            //TODO: better types
            name: string;
            id: string;
            type: 1;
            options: {
                name: string;
                type: 3;
                value: string;
                focused: boolean;
            }[];
        });

        if (getted?.name == apigetted?.name)
            if (getted && getted.options && getted.options[0]) {
                const autocomplete = getted.options[0] as Options;
                if (autocomplete.onAutocomplete)
                    autocomplete.onAutocomplete(interaction);
            }
    }

}

function getCommand(cmd?: Command | CommandOptions): Command | CommandOptions {
    if (!cmd) throw new Error('Command not found');
    if (!cmd.options) return cmd;
    if (!cmd.options.some(x => (x.type == 2) || (x.type == 1))) return cmd;
    return getCommand((cmd.options as (CommandOptions | CommandGroups)[]).find(x => (x.type == 2) || (x.type == 1)));
}

function getApiCommand(cmd?: cmdApi): cmdApi {
    if (!cmd) throw new Error('Command not found');
    if (!cmd?.options) return cmd;
    if (!cmd.options.some(x => (x.type == 2) || (x.type == 1))) return cmd;
    return getApiCommand(cmd.options.find(x => (x.type == 2) || (x.type == 1)));
}

interface cmdApi {
    type?: number | string;
    options?: cmdApi[] | cmdApi[];
    name: string;
}