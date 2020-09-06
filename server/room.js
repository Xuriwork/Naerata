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
            this.sendAll('SERVER_USER-LEFT', message);
        };
    };
    
    removeUser(user) {
        for (let i = this.users.length; i >= 0; i--) {
            if (this.users[i] === user) {
                this.users.splice(i, 1);
            }
        }
    };

    sendAll(author, message) {
        const _message = JSON.stringify({ author, content: message });
        this.users.forEach((user) => user.socket.send(_message));
    };

    sendToSpecificUsers(message, users) {
        const _message = JSON.stringify({ author: 'SERVER', content: message });
        users.forEach((user) => user.socket.send(_message));
    };

    handleOnUserMessage(user) {
        user.socket.on('message', (message) => this.sendAll(user.id, message));
    };
}

module.exports.User = User;
module.exports.Room = Room;