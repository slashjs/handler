import { ContextMenuMessage } from '../../src';

export default <ContextMenuMessage>{
    type: 3,
    name: 'owo message',
    execute(interaction) {
        interaction.reply({
            content: interaction.target.content || 'no-content',
        });
    }
};