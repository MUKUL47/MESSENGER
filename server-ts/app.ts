import Server from './src/server';
new Server().start().then(console.info).catch(console.error)