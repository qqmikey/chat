let Sequelize = require('sequelize');

let settings = {
    dbUser: '',
    dbPass: '',
    dbUrl: 'localhost',
    dbPort: '5432',
    dbName: 'chatapp'
};

let dbConnect = (() => {
    let instance = null;

    let initialize = () => {
        let connectionString = [
            'postgres://',
            settings.dbUser,
            ':',
            settings.dbPass,
            '@',
            settings.dbUrl,
            ':',
            settings.dbPort,
            '/',
            settings.dbName
        ].join('');
        instance = new Sequelize(connectionString);
        return instance;
    };

    return function () {
        return instance === null ? initialize() : instance;
    }
})();

module.exports = {
    db: dbConnect()
};
