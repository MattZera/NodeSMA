/**
 * Created by Zera on 3/23/17.
 */

var Rx = require('rxjs/Rx');
const cp = require('child_process');
const searcher = cp.fork(`${__dirname}/searcher_subprocess.js`);

function send(message, data) {
    searcher.send({message:message,data:data});
};

var messageObservable = Rx.Observable.fromEvent(searcher, 'message');

exports.startStream = ()=>send("start_stream");
exports.stopStream = ()=>send("stop_stream");
exports.search = (term)=>send("search",term);

exports.disconnect = function(){
    searcher.disconnect();
};

exports.messages = messageObservable;
