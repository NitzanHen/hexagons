import WebSocket from 'ws';
import { parseJson } from './common/parseJson';
import { registerFire } from './controller/fires';
import { isFire } from './model/Fire';

process.on('uncaughtException', console.error)

const PORT = parseInt(process.env.PORT!!) || 5000;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (socket) => {
  socket.on('message', message => {

    const { data, err } = parseJson(message.toString());
    if (err) {
      return console.error(err);
    }

    console.log(data);

    if (isFire(data)) {
      registerFire(data);
    }
  });

  socket.send('Hello from server!')
})

console.log(`Server listening on port ${PORT}...`)