const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let electronLive = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!electronLive) {
            console.log('starting electron connecting react');
            electronLive = true;
            const exec = require('child_process').exec;
            exec('npm run electron');
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});