import React from 'react';
import Button from 'muicss/lib/react/button';

export default class RoomList extends React.Component {
    render() {
        return <div className="di">
            {
                this.props.rooms.map((room, i) => {
                    return (
                        <div key={i} className="di" style={{padding: '8px'}}>
                            <Button size="small" color="primary" variant="raised"
                                     onClick={this.props.joinRoom.bind(this, room)}>{room.name}
                                <a onClick={this.props.deleteRoom.bind(this, room)} style={{marginLeft: '16px', color: '#000'}}>x</a>
                             </Button>

                        </div>
                    )
                })
            }
        </div>
    }
}
