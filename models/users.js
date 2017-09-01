/**
 * Created by Administrator on 2017/8/30.
 */
var mongodb = require('./db');

function Users(user){
    this.name = user.name;
    this.password = user.password;
    this.phone = user.phone;
};

module.exports = Users;

Users.save = function(){
    mongodb.save("test",{test:"123"},function (err,data) {
        if(err){
            return console.log(err)
        }
        return console.log(data)
    });
    console.log("hello world")
}