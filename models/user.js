let Sequelize = require('sequelize');
let db = require('../config').db;
// let Message = require('./message');

module.exports = (() => {

    let model = db.define('users', {
        uid: Sequelize.BIGINT,
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
        create: (data) => {
            return model.create(data);
        },
        update: (data, uid) => {
            return model.update(data, {
                where: {
                    uid: uid
                }
            });
        },
        getByUId: (uid) => {
            return model.findOne({
                where: {
                    uid
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
