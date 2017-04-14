/**
 * Created by Zera on 3/15/17.
 */
const socketio = require('socket.io');
const searcher = require('./searcher');

module.exports = function(server){
    var io = socketio(server);

    searcher.messages.subscribe(message=>{
        if (message.id){
            io.to(message.id).emit(message.message, message.data);
        }else{
            io.emit(message.message, message.data);
        }
    });

    searcher.send('start_stream');

    io.on('connection', function(client){
        console.log(client.rooms);
        client.on('get_times', ()=>{
            searcher.send("get_times", {}, client.id)
        });
        client.on('get_tracked_phrases', ()=>{
            searcher.send("get_tracked_phrases", {}, client.id)
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
