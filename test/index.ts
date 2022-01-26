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

server.addCommandWithDirectory(path.join(__dirname, 'commands'), file => {
    return import(file).then(x => x.default);
}).then(() => {
    server.registerCommands('715975367688454214')
        .then(() => {
            console.log('Registered commands', server.commands);
        })
        .catch(console.error);
}).catch(console.error);