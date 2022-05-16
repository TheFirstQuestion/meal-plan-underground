/* jshint node: true */

require('dotenv').config()

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Load the Mongoose schemas
var User = require('./schemas/user.js');
var DiningHall = require('./schemas/dining-hall.js');

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
    },
    {
        first_name: "Steven",
        last_name: "",
        swipes_remaining: 999,
        isDonor: true,
        biography: "dope",
        major: "CS-HCI",
        isDemoUser: true,
    },
    {
        first_name: "Leilenah",
        last_name: "",
        swipes_remaining: 999,
        isDonor: true,
        biography: "dope",
        major: "CS (MS)",
        isDemoUser: true,
    },
    {
        first_name: "Hillary",
        last_name: "",
        swipes_remaining: 999,
        isDonor: false,
        biography: "dope",
        major: "PD",
        isDemoUser: true,
    },
    {
        first_name: "Ellie",
        last_name: "",
        swipes_remaining: 999,
        isDonor: true,
        biography: "dope",
        major: "CS",
        isDemoUser: true,
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

// Remove anything that exists in the collections
var removePromises = [User.deleteMany({}), DiningHall.deleteMany({})];

Promise.all(removePromises).then(function () {
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
        }).then(function (userObj) {
            userObj.save();
            console.log('Adding user:', userObj.first_name + "\n" + userObj);
        }).catch(function (err){
            console.error('Error create user', err);
        });
    });

    var allPromises = Promise.all(userPromises).then(function () {
        // Load the dining halls
        var diningHallPromises = diningHalls.map(function (hall) {
            return DiningHall.create({
                name: hall.name,
            }).then(function (obj) {
                obj.save();
                console.log('Adding dining hall:', obj.name +' with ID ',
                    obj._id);
            }).catch(function (err) {
                console.error('Error creating dining hall', err);
            });
        });
    });

    // Close the connection
    // return Promise.all(allPromises).then(function () {
    //     mongoose.disconnect();
    // });
}).catch(function(err) {
    console.error('Error loading testing data', err);
});
