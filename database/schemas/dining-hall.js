"use strict";
/* jshint node: true */

var mongoose = require('mongoose');

// create a schema
var diningHallSchema = new mongoose.Schema({
    name: String,
});

// the schema is useless so far
// we need to create a model using it
var DiningHall = mongoose.model('DiningHall', diningHallSchema);

// make this available to our users in our Node applications
module.exports = DiningHall;
