var app = require('../app')
var debug = require('debug')('helloworld:server');
var http = require('http');
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Get port from environment and store in Express.
var port = process.env.PORT || '3000';
app.set('port', port);

//  Create HTTP server.
// var server = http.createServer(app);

// Socket IO
io.on('connection', function (socket) {
    // Create a room to broadcast to
    socket.join('main');
    socket.on('statechange', function (data) {
        // Broadcast changes to all clients in room
        socket.to('main').emit('urlchange', { url : data.url });
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
