import { Command, CommandGroups, CommandOptions, Options, ResolvableCommand } from './interfaces/command';
import { AutocompleteInteraction, CommandInteraction, ContextMenuInteraction, MessageContextInteraction, Server, ServerOptions, UserContextInteraction } from '@slash.js/core';
import fs from 'fs/promises';
import path from 'path';

async function getFiles(dir: string): Promise<string[]> {

    const todo = await fs.readdir(dir, { withFileTypes: true });
    const names = [];

    for (const folder of todo) {
        if (folder.isDirectory()) {
            const files = await getFiles(path.join(dir, folder.name));
            for (const file of files) names.push(file);
        } else names.push(path.join(dir, folder.name));
    }

    return names;

}

export interface HandlerEventsOptions {
    onCommandCheck?: (interaction: CommandInteraction) => Promise<boolean> | boolean;
    onAutocompleteCheck?: (interaction: AutocompleteInteraction) => Promise<boolean> | boolean;
    onContextMenuCheck?: (interaction: ContextMenuInteraction) => Promise<boolean> | boolean;
}

export class Handler extends Server {
    commands: ResolvableCommand[] = [];

    constructor(options: ServerOptions, eventsOptions: HandlerEventsOptions = {}) {
        super(options);
        this.on('command', async data => {
            if (!eventsOptions.onCommandCheck || await eventsOptions.onCommandCheck(data))
                this.handleCommand(data);
        });
        this.on('autocomplete', async data => {
            if (!eventsOptions.onAutocompleteCheck || await eventsOptions.onAutocompleteCheck(data))
                this.handleAutocomplete(data);
        });
        this.on('contextMenu', async data => {
            if (!eventsOptions.onContextMenuCheck || await eventsOptions.onContextMenuCheck(data)) {
                if (data.isMessageContext())
                    this.handleMessageContextMenu(data);
                else if (data.isUserContext())
                    this.handleUserContextMenu(data);
            }
        });
    }

    async handleCommand(interaction: CommandInteraction) {
        const comandos = this.commands.filter(x => x.type == 1) as Command[];
        const getted = getCommand(comandos.find(x => x.name == interaction.name)) as CommandOptions;
        const apigetted = getApiCommand(interaction.data);

        if (getted?.name == apigetted?.name) {
            if (!getted.execute) return;
            try {
                if (typeof getted.onBeforeExecute == 'function') {
                    const result = await getted.onBeforeExecute(interaction);
                    if (!result) {
                        if (typeof getted.onCancelExecute == 'function') {
                            await getted.onCancelExecute(interaction);
                        }
                    } else {
                        await getted.execute(interaction);
                    }
                } else {
                    await getted.execute(interaction);
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
        const comandos = this.commands.filter(x => x.type == 1) as Command[];
        const getted = getCommand(comandos.find(x => x.name == interaction.commandName));
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

    async handleMessageContextMenu(interaction: MessageContextInteraction) {
        const command = this.commands
            .filter(x => x.type == interaction.data.type)
            .find(x => x.name == interaction.data.name);

        if (!command) return;
        if (!command.execute) return;
        if (command.type != 3) return;
        try {
            if (typeof command.onBeforeExecute == 'function') {
                const result = await command.onBeforeExecute(interaction);
                if (!result) {
                    if (typeof command.onCancelExecute == 'function') {
                        await command.onCancelExecute(interaction);
                    }
                } else {
                    await command.execute(interaction);
                }
            } else {
                await command.execute(interaction);
            }
        } catch (e) {
            this.emit('commandError', interaction, e);
            if (typeof command.onErrorExecute == 'function') {
                return await command.onErrorExecute(interaction, e);
            }
        }
    }

    async handleUserContextMenu(interaction: UserContextInteraction) {
        const command = this.commands
            .filter(x => x.type == interaction.data.type)
            .find(x => x.name == interaction.data.name);

        if (!command) return;
        if (!command.execute) return;
        if (command.type != 2) return;
        try {
            if (typeof command.onBeforeExecute == 'function') {
                const result = await command.onBeforeExecute(interaction);
                if (!result) {
                    if (typeof command.onCancelExecute == 'function') {
                        await command.onCancelExecute(interaction);
                    }
                } else {
                    await command.execute(interaction);
                }
            } else {
                await command.execute(interaction);
            }
        } catch (e) {
            this.emit('commandError', interaction, e);
            if (typeof command.onErrorExecute == 'function') {
                return await command.onErrorExecute(interaction, e);
            }
        }
    }

    async addCommandWithDirectory(dir: string) {
        const files = await getFiles(dir);
        for (const i of files) {
            if (i.endsWith('.js') || i.endsWith('.ts')) {
                let importedCommand = await import(i);
                importedCommand = importedCommand.__esModule ? importedCommand.default : importedCommand;
                if ([1, 2, 3].includes(importedCommand.type))
                    this.addCommand(importedCommand);
            }
        }
        return this.commands;
    }

    addCommand(command: Command) {
        this.commands.push(command);
        return this;
    }

    addCommands(commands: Command[]) {
        this.commands.push(...commands);
        return this;
    }

    registerCommands(applicationID: string) {
        return this.rest
            .interaction
            .bulkOverwriteApplicationCommands(applicationID, this.commands);
    }

}

function getCommand(cmd?: Omit<Command, 'type'> | Omit<CommandOptions, 'type'>): Omit<Command, 'type'> | Omit<CommandOptions, 'type'> {
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