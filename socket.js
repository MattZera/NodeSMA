/**
 * Created by Zera on 3/15/17.
 */
var socketio = require('socket.io');

module.exports = function(server){
    var io = socketio(server);

    // io.use(function(socket, next){
    //
    // });

    io.on('connection', function(socket){
        console.log("connected");
    });

    return io;
};
