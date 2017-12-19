let Sequelize = require('sequelize');
let db = require('../config').db;
let User = require('./user');
let Room = require('./room');

module.exports = (() => {

    let model = db.define('messages', {
        uid: Sequelize.INTEGER,
        room_id: Sequelize.INTEGER,
        text: Sequelize.TEXT,
    }, {
        freezeTableName: true
    });

    User.model.hasMany(model, {foreignKey: 'uid'});
    model.belongsTo(User.model, {foreignKey: 'uid'});

    Room.model.hasMany(model, {foreignKey: 'room_id'});
    model.belongsTo(Room.model, {foreignKey: 'room_id', onDelete: 'cascade'});

    return {
        init: () => {
            return model.sync({
                force: true
            });
        },
        create: (data) => {
            return model.create(data);
        },
        deleteById: (roomId) => {
            return model.destroy({
                where: {
                    id: roomId
                }
            })
        },
        getList: (roomId) => {
            return model.findAll({
                where: {
                    room_id: roomId
                },
                include: [User.model],
                order: 'id ASC'
            });
        },
        model
    }

})();
