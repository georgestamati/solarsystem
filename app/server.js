var app = require('../app'),
    debug = require('debug')('solarsyste:server'),
    http = require('http');

// Get port from environment and store in Express.
var port = process.env.PORT || '3000';
app.set('port', port);

//  Create HTTP server.
var server = http.createServer(app);

// Socket IO
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    // Create a room
    socket.join('room');
    socket.on('eventchange', function (data) {
        // Broadcast changes to all clients in room
        socket.to('room').emit('urlcontrol', { url : data.url });
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
