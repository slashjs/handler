import dotenv from 'dotenv';
import { Handler } from '../src/index';
import { Command } from '../src/interfaces/command';

dotenv.config();

const server = new Handler({
    publicKey: process.env.PUBLIC_KEY as string,
    token: process.env.BOT_TOKEN as string,
    path: '/',
    port: 3000
});

server.on('ready', () => {
    console.log('Ready', 'xd');
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
            options: [{
                name: 'test',
                type: 3,
                description: 'autocomplete',
                autocomplete: true,
                onAutocomplete(interaction) {
                    const value = (interaction.options.getString('test') || 'no-value') + 'ggg';
                    interaction.send([{ name: value, value }]);
                }
            }],
            execute(interaction) {
                const value = interaction.options.getString('test') || 'no-value';
                interaction.reply({ content: 'test desde @slash.js/handler ' + value });
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
            const value = interaction.options.getString('test') || 'no-value';
            interaction.send([{ name: value, value }]);
        }
    }],
    execute(interaction) {
        const value = interaction.options.getString('test');
        interaction.reply({ content: value || 'no-value' });
    }
}];

server.commands = commands;

server.rest.interaction.bulkOverwriteApplicationCommands('829828127399870504', commands)
    .then(() => {
        console.log('Bulk overwritten');
    }).catch(console.error);