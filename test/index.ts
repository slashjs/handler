/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as SlashJS from '@slash.js/core';
import dotenv from 'dotenv';
import { Handler } from '../src/index';
import { Command } from '../src/interfaces/command';

dotenv.config();

const server = new SlashJS.Server({
    publicKey: process.env.PUBLIC_KEY as string,
    token: process.env.BOT_TOKEN as string,
    path: '/',
});

server.on('ready', () => {
    console.log('Ready');
}).on('error', (error) => {
    console.error(error);
});

const commands: Command[] = [{
    name: 'testing',
    description: 'gg',
    options: [{
        name: 'uno',
        type: 2,
        description: 'xd',
        options: [{
            type: 1,
            name: 'cinco',
            description: 'xd',
            execute(interaction) {
                interaction.reply({ content: 'test desde @slashjs/handler' });
            }
        }]
    }]
}, {
    name: 'autocomplete',
    description: 'autocomplete',
    options: [{
        name: 'test',
        type: 3,
        description: 'autocomplete',
        autocomplete: true,
        onAutocomplete(interaction) {
            console.log(interaction.send([{ name: 'xd', value: 'gg' }]));
        }
    }]
}];

const han = new Handler(commands, server);

server.on('raw', (interaction, reply) => {
    switch (interaction.type) {
        case 2: {
            switch (interaction.data.type) {
                case 1:
                    han.handleCommand(interaction, reply);
                    break;
            }
            break;
        }
        case 4:
            han.handleAutocomplete(interaction, reply);
            break;
    }
});