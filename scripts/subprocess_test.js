#!/usr/bin/env node
/**
 * Created by Zera on 3/16/17.
 */

var Rx = require('rxjs/Rx');
const cp = require('child_process');
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


var launchAnalyser = function(data, callback){
    cp.exec('python3', ['analyser_vader.py', JSON.stringify(data) ], callback);
};


// Install NLTK data
// execFileSync('python3', ['nltk_data_install.py']);

//Create execFileObservable from execFile
var execFileObservable = Rx.Observable.bindNodeCallback(cp.execFile);


var trackTermsSubject = new Rx.BehaviorSubject("angela merkel");

var streamObservable = trackTermsSubject
    .switchMap(
        term => Rx.Observable.fromEvent(client.stream('statuses/filter', {track:term, language: "en", stall_warnings: true}), 'data'));

var env = Object.create( process.env );
env.NLTK_DATA = __dirname+'/nltk_data';

// '-W ignore'

var streamAnalysis = streamObservable
    .flatMap(data => execFileObservable('python3', ['analyser_vader.py', JSON.stringify(data.text) ]), (x, y, ix, iy) => { return y[0]});



streamAnalysis.subscribe(data => console.log(data));

//execFile(__dirname+'/analyser_vader.py', [ "@TwitchSharer: I'm entering to win a Nintendo switch #giveaway #nintendo #twitch #nintendo"], (err,stdout,stderr)=>console.log(stdout));