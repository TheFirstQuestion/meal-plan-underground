/* jshint node: true */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/meal-plan-underground', { useNewUrlParser: true, useUnifiedTopology: true });

// Load the Mongoose schemas
var User = require('./schemas/user.js');

// Hardcoded testing data
const testUsers = [
    {
        first_name: "Alexis",
        last_name: "Lowber",
        // dining_hall_id: mongoose.Schema.Types.ObjectId,
        photo_path: "alexis.png",
        swipes_remaining: 10,
        isDonor: false,
        biography: "she's the best TA",
        major: "CS probably",
    },
];

// We start by removing anything that existing in the collections.
var removePromises = [User.deleteMany({})];

Promise.all(removePromises).then(function () {
    // Load the users into the database as Users
    var userPromises = testUsers.map(function (user) {
        return User.create({
            first_name: user.first_name,
            last_name: user.last_name,
            // dining_hall_id: user.dining_hall_id,
            photo_path: user.photo_path,
            swipes_remaining: user.swipes_remaining,
            isDonor: user.isDonor,
            biography: user.biography,
            major: user.major,
        }).then(function (userObj) {
            userObj.save();
            console.log('Adding user:', userObj.first_name + ' ' + userObj.last_name, ' with ID ',
                userObj._id);
        }).catch(function (err){
            console.error('Error create user', err);
        });
    });

    Promise.all(userPromises).then(function () {
        mongoose.disconnect();
    });

    /*
    var allPromises = Promise.all(userPromises).then(function () {
        // Once we've loaded all the users into the User collection we add all the photos. Note
        // that the user_id of the photo is the MongoDB assigned id in the User object.
        var photoModels = [];
        var userIDs = Object.keys(mapFakeId2RealId);
        for (var i = 0; i < userIDs.length; i++) {
            photoModels = photoModels.concat(cs142models.photoOfUserModel(userIDs[i]));
        }
        var photoPromises = photoModels.map(function (photo) {
            return Photo.create({
                file_name: photo.file_name,
                date_time: photo.date_time,
                user_id: mapFakeId2RealId[photo.user_id]
            }).then(function (photoObj) {
                photo.objectID = photoObj._id;
                if (photo.comments) {
                    photo.comments.forEach(function (comment) {
                        photoObj.comments = photoObj.comments.concat([{
                            comment: comment.comment,
                            date_time: comment.date_time,
                            user_id: comment.user.objectID
                        }]);
                        console.log("Adding comment of length %d by user %s to photo %s",
                            comment.comment.length,
                            comment.user.objectID,
                            photo.file_name);
                    });
                }
                photoObj.save();
                console.log('Adding photo:', photo.file_name, ' of user ID ', photoObj.user_id);
            }).catch(function (err){
                console.error('Error create user', err);
            });
        });
        return Promise.all(photoPromises).then(function () {
            // Create the SchemaInfo object
            return SchemaInfo.create({
                version: versionString
            }).then(function (schemaInfo) {
                console.log('SchemaInfo object ', schemaInfo, ' created with version ', versionString);
            }).catch(function (err){
                console.error('Error create schemaInfo', err);
            });
        });
    });
    */

}).catch(function(err){
    console.error('Error loading testing data', err);
});
