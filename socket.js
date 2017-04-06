/**
 * Created by Zera on 3/15/17.
 */
const socketio = require('socket.io');
const searcher = require('./searcher');

module.exports = function(server){
    var io = socketio(server);


    searcher.messages.filter(message=>message.message=='tweet').subscribe(message=>{
        io.emit('tweet', message.data);
    });
    searcher.startStream();

    io.use(function(socket, next){

        next();
    });

    // io.on('connection', function(socket){
    //
    //     console.log("connected");
    // });

    return io;
};
