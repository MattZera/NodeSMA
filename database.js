/**
 * Created by Zera on 3/16/17.
 */

var MongoClient = require('mongodb').MongoClient;
var co = require('co');

var database;
var init;

module.exports = function(url){

    if (url && !init) {
        init = true;

        co(function*(){
            database = yield MongoClient.connect(url);
        }).catch(function(err){
            console.log('Error: Cannot connect to MongoDB. Make sure mongod is running.');
            process.exit(1);
        });

    }

    return database;
};



