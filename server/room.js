const CHAT_MESSAGE = require('./constants').CHAT_MESSAGE;
const LINE_SEGMENT = require('./constants').LINE_SEGMENT;

class User {
    constructor(socket, id) {
        this.socket = socket;
        this.id = id;
    }
}

class Room {
    constructor(users) {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
        this.handleOnUserMessage(user);
        user.socket.onclose = () => {
            console.log('A connection left.');
            this.removeUser(user);
            const message = `${user.id} has left the room. Total connections: ${this.users.length}`;
            this.sendMessageToAll('SERVER_USER-LEFT', message);
        };
    };
    
    removeUser(user) {
        for (let i = this.users.length; i >= 0; i--) {
            if (this.users[i] === user) {
                this.users.splice(i, 1);
            }
        }
    };

    sendMessageToAll(author, message) {
        const _message = JSON.stringify({ author, content: message, dataType: CHAT_MESSAGE });
        this.users.forEach((user) => user.socket.send(_message));
    };

    sendToSpecificUsers(message, users) {
        const _message = JSON.stringify({ author: 'SERVER', content: message, dataType: CHAT_MESSAGE });
        users.forEach((user) => user.socket.send(_message));
    };

    sendLine(prevPos, currPos, strokeStyle) {
        console.log(prevPos, currPos, strokeStyle)
        const lineData = JSON.stringify({ x, y, strokeStyle, dataType: LINE_SEGMENT });
        this.users.forEach((user) => user.socket.send(lineData));
    };

    handleOnUserMessage(user) {
        user.socket.on('message', (data) => {
            const parsedData = JSON.parse(data);

            if (parsedData.dataType === CHAT_MESSAGE) {
                console.log(parsedData.message)
                this.sendMessageToAll(user.id, parsedData.message);
            } else if (parsedData.dataType === LINE_SEGMENT) {
                parsedData.line.forEach((line) => {
                    this.sendLine(line.start, line.stop, parsedData.strokeStyle);
                })
            }
        });
    };
}

module.exports.User = User;
module.exports.Room = Room;