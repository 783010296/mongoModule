var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var Post = require('../models/posts');

module.exports = function (app) {
    app.get('/test',function(req,res) {
        User.save();
    });
};
