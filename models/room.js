let Sequelize = require('sequelize');
let db = require('../config').db;

module.exports = (() => {

    let model = db.define('rooms', {
        name: Sequelize.TEXT,
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
        },
        model
    }

})();
