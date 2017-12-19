let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Chat app',
        scriptPath: process.env.DEV == 'TRUE' ? 'http://localhost:8080/public' : '/js'
    });
});

module.exports = router;
