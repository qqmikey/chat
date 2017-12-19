var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//table init code
let Room = require('./models/room'),
    User = require('./models/user'),
    RoomUser = require('./models/room_user'),
    Message = require('./models/message'),
    BlockedUser = require('./models/blocked_user');

// Room.init();
// User.init();
// RoomUser.init();
// BlockedUser.init();
// Message.init();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// set a cookie
app.use(function (req, res, next) {
    let cookie = req.cookies.uid;
    if (cookie === undefined) {
        let randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);
        res.cookie('uid', randomNumber, {maxAge: 900000000, httpOnly: true});
        console.log('cookie created successfully');
    }
    else {
        console.log('cookie exists', cookie);
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
