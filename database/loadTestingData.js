/* jshint node: true */
require('dotenv').config()
const bcrypt = require('bcrypt');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Load the Mongoose schemas
var {User, userSchema} = require('./schemas/user.js');
var {DiningHall, diningHallSchema} = require('./schemas/dining-hall.js');
var {Meal, mealSchema} = require('./schemas/meal.js');
var Pairing = require('./schemas/pairing.js');

// Hardcoded testing data
const testUsers = [
    {
        first_name: "Alexis",
        last_name: "Lowber",
        photo_path: "alexis.png",
        swipes_remaining: 10,
        isDonor: false,
        biography: "the best CS 278 TA",
        major: "CS probably",
        isDemoUser: true,
        emailPrefix: "alexis",
    },
    {
        first_name: "Nina",
        last_name: "The Dog",
        photo_path: "nina.jpg",
        swipes_remaining: 10,
        isDonor: true,
        biography: "the love of my life",
        major: "doggo",
        isDemoUser: true,
        emailPrefix: "nina",
    },
    {
        first_name: "Steven",
        last_name: "",
        swipes_remaining: 999,
        isDonor: true,
        biography: "dope",
        major: "CS-HCI",
        isDemoUser: true,
        emailPrefix: "steven",
    },
    {
        first_name: "Leilenah",
        last_name: "",
        swipes_remaining: 999,
        isDonor: true,
        biography: "dope",
        major: "CS (MS)",
        isDemoUser: true,
        emailPrefix: "leilenah",
    },
    {
        first_name: "Hillary",
        last_name: "",
        swipes_remaining: 999,
        isDonor: false,
        biography: "dope",
        major: "PD",
        isDemoUser: true,
        emailPrefix: "hillary",
    },
    {
        first_name: "Ellie",
        last_name: "",
        swipes_remaining: 999,
        isDonor: true,
        biography: "dope",
        major: "CS",
        isDemoUser: true,
        emailPrefix: "ellie",
    },
];

const diningHalls = [
    {
        name: "Arrillaga",
    },
    {
        name: "EVGR",
    },
    {
        name: "Wilbur",
    },
    {
        name: "Stern",
    },
    {
        name: "Branner",
    },
    {
        name: "Casper",
    },
    {
        name: "FloMo",
    },
    {
        name: "Ricker",
    },
    {
        name: "Lakeside",
    },
];

const meals = [
    {
        name: "Breakfast",
    },
    {
        name: "Lunch",
    },
    {
        name: "Dinner",
    },
    {
        name: "Brunch",
    },
];


var passwordHash;
// Remove anything that exists in the collections
var removePromises = [
    User.deleteMany({}),
    DiningHall.deleteMany({}),
    Meal.deleteMany({}),
    Pairing.deleteMany({}),
    // all demo users have the password "test"
    bcrypt.hash("test", 10).then((val) => passwordHash = val)
];


Promise.all(removePromises).then(function () {
    console.log(passwordHash);
    // Load the users into the database
    var userPromises = testUsers.map(function (user) {
        return User.create({
            first_name: user.first_name,
            last_name: user.last_name,
            photo_path: user.photo_path,
            swipes_remaining: user.swipes_remaining,
            isDonor: user.isDonor,
            biography: user.biography,
            major: user.major,
            isDemoUser: user.isDemoUser,
            emailPrefix: user.emailPrefix,
            password: passwordHash,
        }).then(function (userObj) {
            userObj.save();
            console.log('Adding user:', userObj.first_name + "\n" + userObj);
        }).catch(function (err){
            console.error('Error create user', err);
        });
    });

    Promise.all(userPromises).then(function () {
        console.log();
        console.log();
        // Load the dining halls
        var diningHallPromises = diningHalls.map(function (hall) {
            return DiningHall.create({
                name: hall.name,
            }).then(function (obj) {
                obj.save();
                console.log('Adding dining hall: ' + obj.name);
            }).catch(function (err) {
                console.error('Error creating dining hall', err);
            });
        });

        Promise.all(diningHallPromises).then(function () {
            console.log();
            console.log();
            // Load the meals
            var mealPromises = meals.map(function (meal) {
                return Meal.create({
                    name: meal.name,
                }).then(function (obj) {
                    obj.save();
                    console.log('Adding meal: ' + obj.name);
                }).catch(function (err) {
                    console.error('Error creating meal', err);
                });
            });

            Promise.all(mealPromises).then(function () {
                console.log();
                console.log();
                // Create an Alexis / Nina pairing for dinner
                User.findOne({first_name: "Alexis", isDemoUser: true}).exec(function (err, alexis) {
                    User.findOne({first_name: "Nina", isDemoUser: true}).exec(function (err, nina) {
                        Meal.findOne({name: "Dinner"}).exec(function (err, dinner) {
                            return Pairing.create({
                                donor: nina,
                                recipient: alexis,
                                meal: dinner,
                                swipe_completed: true,
                                date_time: new Date(),
                            }).then(function (obj) {
                                obj.save();
                                console.log('Created pairing!\n' + obj);
                            }).catch(function (err) {
                                console.error('Error creating pairing', err);
                            });
                        });
                    });
                });
            });
        });
    });
}).catch(function(err) {
    console.error('Error loading testing data', err);
});
