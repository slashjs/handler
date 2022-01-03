/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
    APIInteraction,
    APIChatInputApplicationCommandInteraction
} from 'discord-api-types';
import { Command, CommandGroups, CommandOptions, Options } from './interfaces/command';
import { FastifyReply } from 'fastify';
import { AutocompleteInteraction, CommandInteraction, Server } from '@slash.js/core';
import { APIAutocompleteApplicationCommandInteraction } from '@slash.js/core/dist/typings';

export class Handler {
    commands: Command[];
    server: Server;
    constructor(commands: Command[], server: Server) {
        this.commands = commands;
        this.server = server;
    }

    handleCommand(__interaction: APIInteraction, reply: FastifyReply) {

        const interaction = __interaction as APIChatInputApplicationCommandInteraction;
        const getted = getCommand(this.commands.find(x => x.name == interaction.data.name));
        const apigetted = getApiCommand(interaction.data);
        const cmd = new CommandInteraction(this.server, interaction, reply);

        if (getted?.name == apigetted?.name)
            if (getted.execute) getted.execute(cmd);
    }

    handleAutocomplete(__interaction: APIInteraction, reply: FastifyReply) {
        const interaction = __interaction as APIAutocompleteApplicationCommandInteraction;
        const getted = getCommand(this.commands.find(x => x.name == interaction.data.name));
        if (getted && getted.options && getted.options[0]) {
            const autocomplete = getted.options[0] as Options;
            if (autocomplete.onAutocomplete)
                autocomplete.onAutocomplete(new AutocompleteInteraction(this.server, interaction, reply));
        }
    }
}

function getCommand(cmd?: Command | CommandOptions): Command | CommandOptions {
    console.log(cmd);
    if (!cmd) throw new Error('Command not found');
    if (!cmd.options) return cmd;
    if (!cmd.options.some(x => x.type == 2 || x.type == 1)) return cmd;
    return getCommand((cmd.options as (CommandOptions | CommandGroups)[]).find(x => x.type == 2 || x.type == 1));
}

function getApiCommand(cmd?: cmdApi): cmdApi {
    if (!cmd) throw new Error('Command not found');
    if (!cmd?.options) return cmd;
    if (!cmd.options.some(x => x.type == 2 || x.type == 1)) return cmd;
    return getApiCommand(cmd.options.find(x => x.type == 2 || x.type == 1));
}

interface cmdApi {
    type: number;
    options?: cmdApi[] | cmdApi[];
    name: string;
}