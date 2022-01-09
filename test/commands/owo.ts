import { ContextMenuUser } from '../../src';

export default <ContextMenuUser>{
    type: 2,
    name: 'owo',
    execute(interaction) {
        interaction.reply({ content: interaction.target.username });
    }
};