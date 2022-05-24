"use strict";
/* jshint node: true */

var {User, userSchema} = require('./user.js');
var {DiningHall, diningHallSchema} = require('./dining-hall.js');
var {Meal, mealSchema} = require('./meal.js');

var mongoose = require('mongoose');

// create a schema
var pairingSchema = new mongoose.Schema({
    donor: userSchema,
    recipient: userSchema,
    meal: mealSchema,
    dining_hall: diningHallSchema,
    swipe_completed: Boolean,
    date_time: Date
});

// the schema is useless so far
// we need to create a model using it
var Pairing = mongoose.model('Pairing', pairingSchema);

// make this available to our users in our Node applications
module.exports = Pairing;
