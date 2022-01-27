import { ContextMenuUser } from '../../src';

export default <ContextMenuUser>{
    type: 2,
    name: 'owo',
    metadata: {
        xdxdxd: true,
        a: 'xdxd'
    },
    async execute(interaction) {
        for (let i = 0; i < 10; i++) {
            interaction.editOrReply({
                content: `${i}`,
            });//hm
        }
    }
};