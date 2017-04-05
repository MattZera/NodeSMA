/**
 * Created by Zera on 3/23/17.
 */

var Rx = require('rxjs/Rx');
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    //bearer_token: process.env.TWITTER_BEARER_TOKEN
});

var send = process.send;

//The Twitter Stream
var streamObservable = trackPhrasesSubject
    .switchMap(
        terms =>
            Rx.Observable.fromEvent(
                client.stream('statuses/filter',
                    {
                        track:terms.toString(), //Array tostring naturally inserts a ',' between strings
                        language: "en",
                        stall_warnings: true,
                        filter_level: "none"
                    }),
                'data'
            )
    ).publish(); //publish to only allow one stream

streamObservable.subscribe(data=>{
   send()
});




var messages = Rx.Observable.fromEvent(process, 'message');


messages.subscribe(data=>{

    var message = data[0];
    var payload = data[1];

    switch (message){
        case "start":



            break;
        case "stop":
            break;
        default:
            break;
    }

});