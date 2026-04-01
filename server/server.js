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

// CORS — allow Angular dev server (ng serve defaults to :4200)
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../public')));

// API routes (cached 10s)
app.use('/', cache(10), route);

// 404 handler
app.use(function (req, res, next) {
    res.status(404).json({ error: 'Not found' });
});

// error handler
app.use(function (err, req, res, next) {
    var status = err.status || 500;
    res.status(status).json({
        error: req.app.get('env') === 'development' ? err.message : 'Internal server error'
    });
});

// Get port and store in Express.
var port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
var server = http.createServer(app);

var key = Math.floor(1000 + Math.random() * 9000);
console.log('Socket pairing key:', key);

// Socket IO — unchanged from original
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.join('room');

    socket.emit('key', {
        code: key
    });

    socket.on('loadKey', function (data) {
        socket.emit('accessKey', {
            access: (parseInt(data.key) === parseInt(key) ? 'granted' : 'denied')
        });
    });

    socket.on('mobileConnected', function (data) {
        socket.to('room').emit('openDesktopApp', {
            loader: data.clickButton
        });
    });

    socket.on('showTooltipFromMobile', function (data) {
        socket.to('room').emit('showTooltipOnDesktop', {
            id: data.id,
            click: data.click
        });
    });

    socket.on('showMobileInfo', function (data) {
        socket.to('room').emit('showMobileInfoOnDesktop', {
            value: data.value
        });
    });

    socket.on('eventchange', function (data) {
        socket.to('room').emit('urlcontrol', {
            url: data.url
        });
    });
});

// Listen on provided port
server.listen(port, function () {
    console.log('API server listening on port ' + port);
});
