/**
 * Created by Zera on 3/16/17.
 */

const execFile = require('child_process').execFile;
const n = cp.fork(`${__dirname}/tweet_searcher.js`);


var Rx = require('rxjs/Rx');


Rx.Observable.fromNode

var child_message_observable = Rx.Observable.fromEvent(n,'message');

var subscription = child_message_observable
    .filter(message => message.type == 'search')
    .subscribe(message => {
        console.log(message);
        subscription.unsubscribe();
        n.disconnect();
    });


n.send({ type: 'search' });