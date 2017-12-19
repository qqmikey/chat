let Room = require('./models/room');
let Message = require('./models/message');
let User = require('./models/user');
let BlockedUser = require('./models/blocked_user');
let Utils = require('./utils');

class Chat {

    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.uid = Utils.getCookie('uid', socket.handshake.headers.cookie);
    }

    static putMessage(uid, roomId, msg) {
        return Message.create({uid: uid, room_id: roomId, text: msg})
    };

    static getMessages(roomId) {
        return Message.getList(roomId);
    };

    createRoom(roomName) {
        return Room.create({name: roomName}).then(this.sendChatInfo.bind(this));
    }

    deleteRoom(roomId) {
        return Room.deleteById(roomId).then(() => {
            this.io.emit('room:deleted', {id: roomId});
        });
    };

    static getRooms() {
        return Room.getList();
    }

    putRoomMember(data) {
        if (this.io.sockets.connected[this.socket.id]) {
            BlockedUser.isBanned(this.uid, data.joinRoomId).then(() => {
                // user is blocked for this room
            }, () => {
                this.io.sockets.connected[this.socket.id].emit('room:joined', data.joinRoomId);
                Chat.getMessages(data.joinRoomId).then((messages) => {
                    this.io.sockets.connected[this.socket.id].emit('room:messages', messages.map((message) => {
                        return {
                            name: message.user.name,
                            text: message.text
                        }
                    }));
                });
            });
        }
    };

    deleteRoomMember(roomId) {
        this.socket.leave('room' + roomId);
    };

    blockRoomMember(data) {
        BlockedUser.create({rood_id: data.roomId, uid: data.uid, expire: data.expiration}).then((block) => {
            if (this.io.sockets.connected[this.socket.id]) {
                this.io.sockets.connected[this.socket.id].emit('user:blocked', block);
            }
        })
    };

    sendChatInfo() {
        Chat.getRooms().then((rooms) => {
            User.getByUId(this.uid).then((user) => {
                if (user === null && this.uid) {
                    User.create({uid: this.uid}).then((user) => {
                        this.io.emit('chat', {rooms: rooms, user});
                    });
                } else {
                    this.io.emit('chat', {rooms: rooms, user});
                }
            });
        });
    }

}

module.exports = {
    initialize: (server) => {
        let io = require('socket.io')(server);
        io.on('connection', (socket) => {
            let uid = Utils.getCookie('uid', socket.handshake.headers.cookie);
            console.log('a user connected');
            let chat = new Chat(io, socket);
            chat.sendChatInfo();

            socket.on('user:login', (data) => {
                let userName = data.userName;
                if (userName) {
                    User.update({
                        name: userName
                    }, uid)
                }
            });

            socket.on('user:logout', (data) => {
                User.update({
                    name: null
                }, uid).then(() => {
                    chat.sendChatInfo();
                });
            });

            socket.on('chat:getRooms', chat.sendChatInfo.bind(chat));

            socket.on('room:create', chat.createRoom.bind(chat));

            socket.on('room:delete', chat.deleteRoom.bind(chat));

            socket.on('room:join', (data) => {
                socket.join('room' + data.joinRoomId);
                if (data.leaveRoomId) {
                    chat.deleteRoomMember(data.leaveRoomId)
                }
                chat.putRoomMember(data);
            });

            socket.on('room:message', (data) => {
                User.getByUId(uid).then((user) => {
                    if (user) {
                        Chat.putMessage(user.id, data.room, data.text).then((message) => {
                            io.to('room' + data.room).emit('room:message', {
                                name: user.name,
                                text: message.text
                            });
                        });
                    }
                });
            });

            socket.on('user:block', chat.blockRoomMember.bind(chat));

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });

    },
    Chat
};