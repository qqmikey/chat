import RoomList from './components/rooms.jsx';
import io from 'socket.io-client';

import React from 'react';
import ReactDOM from 'react-dom';

import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import Textarea from 'muicss/lib/react/textarea';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Divider from 'muicss/lib/react/divider';

let Utils = require('../utils');

let socket = io();

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            messageText: '',
            messages: [],
            activeRoom: null,
            userName: null
        }
    }

    _askForNickName(cb) {
        let userName = this.state.userName;
        if (userName === null) {
            let userName = prompt('Нужен ник');
            if (userName) {
                this.setState({userName}, cb)
            } else {
                this._askForNickName();
            }
        }
    }

    _logout() {
        socket.emit('user:logout')
    }

    _messageChange(e) {
        let messageText = e.target.value;
        this.setState({messageText});
    }

    _handleKeyUp(e) {
        if(e.keyCode == 13){
            if(!e.shiftKey) {
                this.sendMessage();
            }
        }
    }

    componentDidMount() {
        let that = this;

        socket.on('chat', data => {
            console.log(data);
            if (data.rooms) {
                this.setState({rooms: data.rooms})
            }

            if (data.user && data.user.name) {
                this.setState({userName: data.user.name})
            } else {
                this.setState({userName: null}, () => {
                    this._askForNickName(() => {
                        socket.emit('user:login', {userName: that.state.userName})
                    });
                });
            }
        });

        socket.on('room:message', (message) => {
            let messages = this.state.messages;
            messages.push(message);
            this.setState({messages});
        });

        socket.on('room:messages', (messages) => {
            this.setState({messages}, () => {
                let wrap = document.getElementById("messages");
                wrap.scrollTop = wrap.scrollHeight;
            });
        });

        socket.on('room:joined', (roomId) => {
            if (roomId) {
                this.setState({activeRoom: roomId});
            }
        });

        socket.on('room:deleted', (room) => {
            if (room) {
                //TODO: check if deleted current room close chat windos
                let activeRoom = that.state.activeRoom;
                if (room.id === activeRoom) {
                    that.setState({activeRoom: null});
                }
                socket.emit('chat:getRooms');
            }
        });
    }

    createRoom() {
        let roomName = prompt('Название комнаты');
        if (roomName) {
            socket.emit('room:create', roomName);
        }
    }

    deleteRoom(room) {
        socket.emit('room:delete', room.id);
    }

    joinRoom(room) {
        if (this.state.userName) {
            socket.emit('room:join', {joinRoomId: room.id, leaveRoomId: this.state.activeRoom});
        }
    }

    sendMessage() {
        let activeRoom = this.state.activeRoom;
        if (activeRoom) {
            socket.emit('room:message', {room: activeRoom, text: this.state.messageText});
            this.setState({messageText: ''});
        }
    }

    _roomBlock() {
        if (this.state.activeRoom) {
            return (
                <div>
                    <div className="messages-area" id="messages">
                        {
                            this.state.messages.map((message, i) => {
                                return (
                                    <div key={i}>
                                        <div className="mui--text-dark-secondary">{message.name}</div>
                                        <div>
                                            <p key={i}>{message.text}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <Row>
                        <Col sm="8">
                            <Textarea hint="Введите сообщение" value={this.state.messageText}
                                      onChange={this._messageChange.bind(this)} onKeyUp={this._handleKeyUp.bind(this)}/>
                        </Col>
                        <Col sm="3" md-offset="1">
                            <Button variant="flat" color="primary"
                                    onClick={this.sendMessage.bind(this)} style={{marginTop: '24px'}}>отправить</Button>
                        </Col>
                    </Row>


                </div>
            )
        }
    }

    currentRoomBlock() {
        if (this.state.activeRoom) {
            return (
                <div> текущая комната {this.state.activeRoom}</div>
            )
        }
    }

    render() {
        return (
            <div>
                <div className="content-wrap">
                    <Appbar>
                        <table width="100%">
                            <tbody>
                            <tr style={{verticalAlign: 'middle'}}>
                                <td className="mui--appbar-height" style={{padding: '8px'}}>
                                    Привет, {this.state.userName}
                                    &nbsp;
                                    {this.currentRoomBlock()}
                                </td>
                                <td className="mui--appbar-height" style={{textAlign: 'right', padding: '8px'}}><a
                                    onClick={this._logout.bind(this)}>Выход</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </Appbar>
                    <div>
                        <h2>Список комнат</h2>
                        <RoomList rooms={this.state.rooms} deleteRoom={this.deleteRoom}
                                  joinRoom={this.joinRoom.bind(this)}/>
                        <Button size="small" color="primary" variant="fab" onClick={this.createRoom}>+</Button>
                        <Divider />
                        {this._roomBlock()}
                    </div>
                </div>
                <footer id="footer">
                    <div className="mui-container-fluid">
                        <br />
                        <p className="mui--text-center">© 2017</p>
                    </div>
                </footer>
            </div>
        )
    }
}


let container = document.getElementById('app');
if (container) {
    ReactDOM.render(<App/>, container);
} else {
    alert('smth wnt wrng')
}
