/**
 * Created by Administrator on 2017/8/30.
 */

var settings = require('../settings');
var MongoClient = require('mongodb').MongoClient;

var connectObj = {};
var Db = (new MongoClient()).connect(settings.url);

connectObj.insert = function(name,data,callback){
    Db.then(function (db) {
        db.collection(name).insertOne(data,{}).then(function(data){
            callback(null,data);
        }).catch(function(err){
            callback(err,null);
        })
    }).catch(function (err) {
        callback(err,null);
    });
}

connectObj.getOne = function (name,quety,callback) {
    Db.then(function (db) {
        db.collection(name).findOne(query,function (err,result) {
            callback(err,result);
        })
    }).catch(function(err){
        callback(err,null);
    })
}

connectObj.getBySize = function(name,query,size,callback){
    Db.th
}

connectObj.update

module.exports = Db;
