import dotenv from 'dotenv';
import { Handler } from '../src/index';
import { ResolvableCommand } from '../src/interfaces/command';

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

const commands: ResolvableCommand[] = [{
    type: 1,
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
            onBeforeExecute(interaction) {
                return interaction.user.id == interaction.user.id;
            },
            execute(interaction) {
                const value = interaction.options.getString('test') || 'no-value';
                interaction.reply({ content: 'test desde @slash.js/handler ' + value });
            },
            onCancelExecute(interaction) {
                return interaction.reply({ content: 'cancelado' });
            },
            onErrorExecute(interaction, error) {
                console.error(error);
                interaction[interaction.res.sent ? 'editReply' : 'reply']({
                    content: error instanceof Error ? error.toString() : 'error',
                });
            }
        }]
    }]
}, {
    type: 1,
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
}, {
    type: 2,
    name: 'owo',
    execute(interaction) {
        interaction.reply({ content: 'owo' });
    }
}];//!Not supported yet

server.commands = commands;

server.rest.interaction.bulkOverwriteApplicationCommands('829828127399870504', commands)
    .then(() => {
        console.log('Bulk overwritten');
    }).catch(console.error);