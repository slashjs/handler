import { ContextMenuUser } from '../../src';

export default <ContextMenuUser>{
    type: 2,
    name: 'owo',
    metadata: {
        xdxdxd: true,
        a: 'xdxd'
    },
    execute(interaction) {
        interaction.reply({ content: interaction.target.username });
    }
};