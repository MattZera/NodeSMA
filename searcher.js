/**
 * Created by Zera on 3/23/17.
 */

var Rx = require('rxjs/Rx');
const cp = require('child_process');
const searcher = cp.fork(`${__dirname}/searcher_subprocess.js`);

exports.send = function(data) {
    searcher.send(data);
};

const messageObservable = Rx.Observable.defer(()=>{
    Rx.Observable.fromEvent(searcher, 'message');
}).share();

exports.disconnect = function(){
    searcher.disconnect();
};

exports.messages = messageObservable;
