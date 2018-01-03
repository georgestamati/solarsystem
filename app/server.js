var app = require('../app'),
    debug = require('debug')('solarsystem:server'),
    http = require('http');

// Get port from environment and store in Express.
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

    socket.on('loadKey', function(data){
        socket.emit('accessKey', {
            access: (parseInt(data.key) === parseInt(key) ? "granted" : "denied")
        });
    });

    socket.on('eventchange', function (data) {
        socket.to('room').emit('urlcontrol', {
            url: data.url
        });
    });
});

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Event listener for HTTP server "error" event.
function onError(error) {
  	if (error.syscall !== 'listen') {
    	throw error;
  	}
}

// Event listener for HTTP server "listening" event.
function onListening() {
  	var addr = server.address();
  	var bind = typeof addr === 'string'
    	? 'pipe ' + addr
    	: 'port ' + addr.port;
  	debug('Listening on ' + bind);
}
