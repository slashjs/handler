import { Command } from '../../src';

export default <Command>{
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
};