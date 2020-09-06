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
        };
    };
    
    removeUser(user) {
        for (let i = this.users.length; i >= 0; i--) {
            if (this.users[i] === user) {
                this.users.splice(i, 1);
            }
        }
    };

    sendAll(message) {
        this.users.forEach((user) => user.socket.send(message));
    };

    sendToSpecificUsers(message, users) {
        users.forEach((user) => user.socket.send(message));
    };

    handleOnUserMessage(user) {
        user.socket.on('message', (message) => {
            this.sendAll(`${user.id} said: ${message}`);
        });
    };
}

module.exports.User = User;
module.exports.Room = Room;