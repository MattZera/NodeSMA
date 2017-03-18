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



// Install NLTK data
execFileSync('python3', ['nltk_data_install.py']);

// Create execFileObservable from execFile
var execFileObservable = Rx.Observable.bindNodeCallback(execFile);


var trackTermsSubject = new Rx.BehaviorSubject("angela merkel");

var streamObservable = trackTermsSubject
    .switchMap(
        term => Rx.Observable.fromEvent(client.stream('statuses/filter', {track:term, language: "en", stall_warnings: true}), 'data'));



var streamAnalysis = streamObservable
    .flatMap(string => execFileObservable('python3', ['-W ignore', 'analyser.py', string]), (x, y, ix, iy) => { return "compound:"+JSON.parse(y[0]).compound+"-->"+x.text});



streamAnalysis.subscribe(data => console.log(data.toString()));