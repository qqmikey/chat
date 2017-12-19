let Sequelize = require('sequelize');
let db = require('../config').db;
let User = require('./user');

module.exports = (() => {

    let model = db.define('blocked_users', {
        uid: Sequelize.INTEGER,
        room_id: Sequelize.INTEGER,
        expire: Sequelize.DATE
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
        isBanned: (uid, roomId) => {
            return new Promise((resolve, reject) => {
                User.getByUId(uid).then((user) => {
                    if (user) {
                        model.findOne({
                            where: {
                                uid: user.id,
                                room_id: roomId,
                                // expire: {
                                //     $lt: 'now'
                                // }
                            }
                        }).then((blockedUser) => {
                            blockedUser ? resolve() : reject();
                        });
                    } else {
                        resolve();
                    }
                });
            });
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
