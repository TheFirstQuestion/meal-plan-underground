"use strict";
/* jshint node: true */

var mongoose = require('mongoose');

// create a schema
var userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    dining_hall_id: mongoose.Schema.Types.ObjectId,
    photo_path: String,
    swipes_remaining: Number,
    isDonor: Boolean,
    biography: String,
    major: String,
    isDemoUser: Boolean,
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
