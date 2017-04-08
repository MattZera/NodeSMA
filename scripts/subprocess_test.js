#!/usr/bin/env node
/**
 * Created by Zera on 3/16/17.
 */

var Rx = require('rxjs/Rx');
const cp = require('child_process');
const LRUMap = require('lru_map').LRUMap;
const execFile = cp.execFile;
const execFileSync = cp.execFileSync;
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    //bearer_token: process.env.TWITTER_BEARER_TOKEN
});

// Install NLTK data
// execFileSync('python3', ['nltk_data_install.py']);

const MAX_TRACKED_PHRASES = 400;
var termMap = new LRUMap(MAX_TRACKED_PHRASES);

var trackPhrasesSubject = (new Rx.Subject()).map(term=>{
    termMap.set(term,true);
    return Array.from(termMap.keys());
});

//switchmap the observable which tracks the terms via the twitter api
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
    ).publish(); //publish method is used to ensure only one stream is created

var tweetStreamObservable = streamObservable.refCount().filter(data => data.hasOwnProperty('text'));
var warningStreamObservable = streamObservable.filter(data => data.hasOwnProperty('warning'));
var limitStreamObservable = streamObservable.filter(data => data.hasOwnProperty('limit'));



//Create execFileObservable from execFile
var execFileObservable = Rx.Observable.bindNodeCallback(cp.execFile);

//launch a python process to analyze each tweet and flatmap the returns to the same observable
var streamAnalysis = tweetStreamObservable
    .concatMap(
        data => execFileObservable(
            'python3',
            ['-W ignore', 'analyser_vader.py', JSON.stringify(data.text) ]
        ),
        (x, y, ix, iy) => { x.sentiment = JSON.parse(y[0]); return x}
        ).share();


var phrase_streams = {};
function getStreamForPhrase(phrase){
    if (!phrase_streams[phrase]){
        phrase_streams[phrase] = Rx.Observable.defer(() => {
                trackPhrasesSubject.next(phrase);
                return streamAnalysis.filter(data => data[0].text.toLowerCase().includes(phrase.toLowerCase()))
            }
        ).share();
    }
    return phrase_streams[phrase];
}


warningStreamObservable.subscribe(data => console.error("Warning: " + data["warning"]["code"]));
//limitStreamObservable.subscribe(data => console.error("Limit: " + data["limit"]["track"]));


streamAnalysis.subscribe(data => {
    var mystring = "score:"+data.sentiment["compound"]+" Text:"+data;
    //console.log('\x1b[36m%s\x1b[0m', mystring);
    console.log(data);
});

// getStreamForPhrase("trump").subscribe(data => {
//     var mystring = "score:"+data[1]["compound"]+" Text:"+data[0].text;
//     return console.log('\x1b[31m%s\x1b[0m', mystring);
// });
//
// getStreamForPhrase("nintendo").subscribe(data => {
//     var mystring = "score:"+data[1]["compound"]+" Text:"+data[0].text;
//     return console.log('\x1b[33m%s\x1b[0m:', mystring);
// });
//
// getStreamForPhrase("obama").subscribe(data => {
//     var mystring = "score:"+data[1]["compound"]+" Text:"+data[0].text;
//     return console.log('\x1b[36m%s\x1b[0m', mystring);
// });
//
// getStreamForPhrase("twitter").subscribe(data => {
//     var mystring = "score:"+data[1]["compound"]+" Text:"+data[0].text;
//     return console.log('%s', mystring);
// });

// addPhrase("nintendo");
//
// Rx.Observable.timer(20000).subscribe(
//     ()=>addPhrase("trump")
// );
//
// Rx.Observable.timer(40000).subscribe(
//     ()=>addPhrase("obamacare")
// );

trackPhrasesSubject.next("obama");
trackPhrasesSubject.next("trump");
trackPhrasesSubject.next("nintendo");
trackPhrasesSubject.next("twitter");
trackPhrasesSubject.next("cnn");
