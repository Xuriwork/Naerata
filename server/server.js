const WebSocket = require('ws');
const User = require('./room').User;
const Room = require('./room').Room;

const port = 8000;

const server = new WebSocket.Server({ port });
const drawingGameRoom = new Room();

server.on('connection', (socket, req) => {
    console.log('A connection established.');

    const id = req.headers['sec-websocket-protocol'];
    const user = new User(socket, id);

    drawingGameRoom.addUser(user);
    const message = `${user.id} has joined the room. Total connections: ${drawingGameRoom.users.length}`;
    drawingGameRoom.sendAll('SERVER_USER-JOINED', message);
});

server.on('close', () => {
    console.log('Server closed')
});

server.on('error', (error) => {
    console.log(error);
});

console.log("WebSocket server is running.");