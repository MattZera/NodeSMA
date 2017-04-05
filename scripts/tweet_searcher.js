/**
 * Created by Zera on 3/16/17.
 */

var TERM_SEARCH_LIMIT = 86400;// 1 day

var Rx = require('rxjs/Rx');
var db = require('../database')('mongodb://localhost:27017/DMWebTool');

var messageObservable = Rx.Observable.fromEvent(process, "message");

messageObservable
    .filter(message => message.type == 'search')
    .subscribe(message => {
        process.send({type:'search', response:'hello world'});
    });

