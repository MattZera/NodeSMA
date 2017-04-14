/**
 * Created by Zera on 3/23/17.
 */

const cp = require('child_process');
const Rx = require('rxjs/Rx');
const Twitter = require('twitter');
const LRUCache = require("lru-cache");
//const db = require('./database')('mongodb://localhost:27017/SMA');

//
//Twitter Api
//

//Twitter access credentials must be provided as runtime variables

//Stream client for user streams
var streamClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//Search client for app search
var searchClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

//
//LRU Map
//

const MAX_TRACKED_PHRASES = 400;

var lru_options = {
    max: MAX_TRACKED_PHRASES,
    //length: function (n, key) { return 1 },
    //dispose: function (key, n) { n.close() },
    maxAge: 1000 * 60 * 60 // 1 hour
};

var termMap = new LRUCache(lru_options);

//
//Phrase Stream
//

//subject for injecting trends manually
var trackPhrasesSubject = new Rx.Subject();

//the trending phrases in the US every 15 seconds
var trendingPhrases = Rx.Observable.timer(0, 1000 * 15)
    .switchMapTo(searchClient.get('trends/place',{id:23424977}))
    .concatMap(data=>Rx.Observable.from(data[0].trends))
    .map(trend=>trend.name);

//combined stream of phrases exported to a list from the lru-cache
var phrasesListStream = Rx.Observable
    .from([trackPhrasesSubject,trendingPhrases])
    .flatMap(x=>x,(stream, term, streamNum,termNum)=>{
        var maxAge = streamNum == 1 ? 1000 * 60 * 60 * 2 : undefined;
        termMap.set(term, true, maxAge);
        return termMap.keys();
    });

//
//Twitter stream
//

//start the twitter stream
var streamObservable = phrasesListStream
    .sample(Rx.Observable.timer(1000, 1000 * 60 * 60)) //resample every hour but start right now
    .distinctUntilChanged() //dont reset the stream if the terms havn't changed
    .switchMap(
        terms =>{
        console.log('changing stream');

            return Rx.Observable.fromEvent(
                streamClient.stream('statuses/filter',
                    {
                        track:terms.toString(), //Array tostring naturally inserts a ',' between strings
                        language: "en",
                        stall_warnings: true,
                        filter_level: "none"
                    }),
                'data'
            );}
    ).publish(); //publish to only allow one stream

var tweetStream = streamObservable.refCount().filter(tweet=> typeof tweet.text == 'string');
//var messageStream = streamObservable.filter(tweet => tweet.text == undefined).subscribe(message=>console.error(message));

//Create execFileObservable from execFile
var execFileObservable = Rx.Observable.bindNodeCallback(cp.execFile);

//launch a python process to analyze each tweet and flatmap the returns to the same observable
var streamAnalysis = tweetStream
    .map(tweet=>{
        var text = tweet.truncated == true ? tweet.extended_tweet.full_text : tweet.text
        return {
            text:text,
            user:{
                name:tweet.user.name,
                screen_name:tweet.user.screen_name
            }
        };
    })
    //Todo: figure out a way to analyse more than one at once
    .concatMap(
        data => execFileObservable(
            'python3',
            ['-W ignore', __dirname+'/scripts/analyser_textblob.py', JSON.stringify(data.text) ]
        ),
        (x, y, ix, iy) => { x.sentiment = JSON.parse(y[0]); return x}
    ).map(tweet=>{

        tweet.sma_keywords = [];
        for(var key of termMap.keys()){
            if (tweet.text.toLowerCase().includes(key.toLowerCase())){
                tweet.sma_keywords.push(key)
            }
        }
        return tweet;
        }
    ).publish();

var streamSubscription = streamAnalysis.subscribe(data=>{
    process.send({message:"tweet", data:data});
});

var dbSubscription = streamAnalysis.groupBy(tweet=>tweet.sma_keywords[0])
    .flatMap(obs=>{
        var key = obs.key;
        var total = 3;
        return obs.windowCount(total)
            .flatMap(
                obs=>
                    obs.map(
                        tweet=>
                            tweet.sentiment.compound > 0 ? 1 : 0
                    ).count(x=>x==1))
            .map(
                count=> {
                    return {phrase:key, count:count, total:total};
                }
            );

    }).subscribe(data=>console.log(data));


//
//Messaages
//

function send(message, data, id){
    process.send({message:message, data:data, id:id});
}

//handle messages to and from the process
var messages = Rx.Observable.fromEvent(process, 'message');
messages.subscribe(message=>{
    console.log('subprocess message: ' + message.message + " from: " + (message.id ? message.id : "Server") );
    switch (message.message){
        case "start_stream":
            streamAnalysis.connect();
            send('stream_started');
            break;
        case "stop_stream":
            if (!streamSubscription) break;
            streamSubscription.unsubscribe();
            break;
        case "get_tracked_phrases":
            send('tracked_phrases', termMap.keys(), message.id);
            break;
        case "get_times":
            execFileObservable(
                'python3',
                ['-W ignore', __dirname+'/scripts/latimes.py']
            ).subscribe(data=>send('times_data', JSON.parse(data[0]), message.id));
            break;
        case "search":
            Rx.Observable.fromPromise(searchClient.get('search/tweets',{
                q:message.data,
                result_type: 'recent',
                count:100,
                language: "en"
            }))
            .subscribe(data=>send("search_result", data, message.id));
            break;
        default:
            break;
    }
});