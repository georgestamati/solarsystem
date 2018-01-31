var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    compression = require('compression'),
    route = require('./routes'),
    http = require('http'),
    cache = require('./cache'),
    app = express();

// enable compression
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view cache', true);

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));

// setup routes and use cache
app.use('/', cache(10), route);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, providing error only in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('../../views/error', {
        'title': '404 - Page not found'
    });
});

// Get port and store in Express.
var port = process.env.PORT || '3000';
app.set('port', port);

//  Create HTTP server.
var server = http.createServer(app);


var key = Math.floor(1000 + Math.random() * 9000);
console.log(key);

// Socket IO
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    // Create a room
    socket.join('room');

    socket.emit('key', {
        code: key
    });

    socket.on('loadKey', function(data){
        socket.emit('accessKey', {
            access: (parseInt(data.key) === parseInt(key) ? "granted" : "denied")
        });
    });

    socket.on('mobileConnected', function (data) {
        socket.to('room').emit('openDesktopApp', {
            loader: data.clickButton
        })
    });

    socket.on('showTooltipFromMobile', function (data) {
       socket.to('room').emit('showTooltipOnDesktop', {
           id: data.id,
           click: data.click
       })
    });

    socket.on('showMobileInfo', function (data) {
        socket.to('room').emit('showMobileInfoOnDesktop', {
            value: data.value
        })
    });

    socket.on('eventchange', function (data) {
        socket.to('room').emit('urlcontrol', {
            url: data.url
        });
    });
});

// Listen on provided port
server.listen(port);