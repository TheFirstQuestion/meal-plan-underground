"use strict";
/* jshint node: true */

var mongoose = require('mongoose');

// create a schema
var mealSchema = new mongoose.Schema({
    name: String,
});

// the schema is useless so far
// we need to create a model using it
var Meal = mongoose.model('Meal', mealSchema);

// make this available to our users in our Node applications
module.exports = {Meal, mealSchema};
