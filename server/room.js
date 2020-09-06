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
        for (let i = 0, numberOfUsers = this.users.length; i < numberOfUsers; i++) {
            this.users[i].socket.send(message);
        }
    }
}

module.exports.User = User;
module.exports.Room = Room;