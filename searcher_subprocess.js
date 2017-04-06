/**
 * Created by Zera on 3/23/17.
 */

const Rx = require('rxjs/Rx');
const Twitter = require('twitter');
const LRUMap = require('lru_map').LRUMap;

//Twitter access credentials must be provided as runtime variables
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    //bearer_token: process.env.TWITTER_BEARER_TOKEN
});

const MAX_TRACKED_PHRASES = 400;
var termMap = new LRUMap(MAX_TRACKED_PHRASES);

var trackPhrasesSubject = (new Rx.Subject()).map(term=>{
    termMap.set(term,true);
    return Array.from(termMap.keys());
});

//The Twitter Stream
var streamObservable = trackPhrasesSubject
    .debounce(()=>Rx.Observable.timer(100))
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
    ).share(); //publish to only allow one stream


var streamSubscription;

function send(message, data){
    process.send({message:message, data:data});
}

var messages = Rx.Observable.fromEvent(process, 'message');
messages.subscribe(message=>{
    console.log('subprocess message: ' + message.message);
    switch (message.message){
        case "start_stream":
            if (streamSubscription) break;
            var streamSubscription = streamObservable.subscribe(data=>{
                process.send({message:"tweet",data:data});
            });
            send('stream_started');
            trackPhrasesSubject.next('trump');
            break;
        case "stop_stream":
            if (!streamSubscription) break;
            streamSubscription.unsubscribe();
            break;
        default:
            break;
    }

});