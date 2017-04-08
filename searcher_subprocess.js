/**
 * Created by Zera on 3/23/17.
 */

const cp = require('child_process');
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

// Install NLTK data
cp.execFileSync('python3', ['scripts/nltk_data_install.py']);

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


//Create execFileObservable from execFile
var execFileObservable = Rx.Observable.bindNodeCallback(cp.execFile);

//launch a python process to analyze each tweet and flatmap the returns to the same observable
var streamAnalysis = streamObservable
    .filter(tweet=>
    typeof tweet.contributors == 'object' &&
    typeof tweet.id_str == 'string' &&
    typeof tweet.text == 'string')//make sure its a tweet before sending it
    .map(tweet=>{
        return {
            text:tweet.truncated == true ? tweet.extended_tweet.full_text : tweet.text,
            user:{
                name:tweet.user.name,
                screen_name:tweet.user.screen_name
            }
        };
    })
    .concatMap(
        data => execFileObservable(
            'python3',
            ['-W ignore', 'scripts/analyser_textblob.py', JSON.stringify(data.text) ]
        ),
        (x, y, ix, iy) => { x.sentiment = JSON.parse(y[0]); return x}
    ).share();

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
            var streamSubscription = streamAnalysis.subscribe(data=>{
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