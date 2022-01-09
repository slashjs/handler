import dotenv from 'dotenv';
import path from 'path';
import { Handler } from '../src/index';

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

server.addCommandWithDirectory(path.join(__dirname, 'commands'))
    .then(() => {
        server.registerCommands('829828127399870504')
            .then(() => {
                console.log('Registered commands');
            })
            .catch(console.error);
    }).catch(console.error);