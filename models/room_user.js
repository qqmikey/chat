let Sequelize = require('sequelize');
let db = require('../config').db;

module.exports = (() => {

    let model = db.define('room_users', {
        uid: Sequelize.INTEGER,
        room_id: Sequelize.INTEGER,
    }, {
        freezeTableName: true
    });

    return {
        init: () => {
            return model.sync({
                force: true
            });
        },
        create: (room) => {
            return model.create(room);
        },
        deleteById: (roomId) => {
            return model.destroy({
                where: {
                    id: roomId
                }
            })
        },
        getList: () => {
            return model.findAll({
                // where: {
                //     $or: [
                //         {id: 2},
                //         {id: 3}
                //     ]
                // }
            });
        }
    }

})();
