/**
 * Created by Zera on 3/15/17.
 */
const socketio = require('socket.io');
const searcher = require('./searcher');

module.exports = function(server){
    var io = socketio(server);

    searcher.messages.subscribe(message=>{
        io.emit(message.message, message.data);
    });
    searcher.startStream();

    io.on('connection', function(client){
        client.on('get_times', ()=>{
            searcher.getTimes();
        });
    });

    io.use(function(socket, next){
        next();
    });

    // io.on('connection', function(socket){
    //
    //     console.log("connected");
    // });

    return io;
};
