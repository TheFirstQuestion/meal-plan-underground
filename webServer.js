require('dotenv').config()

/* jshint node: true */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var async = require('async');
var express = require('express');
var app = express();

// via project7 spec
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
const fs = require("fs");
const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
const bcrypt = require('bcrypt');

// Load the Mongoose schemas
var {User} = require('./database/schemas/user.js');
var {DiningHall} = require('./database/schemas/dining-hall.js');
var {Meal} = require('./database/schemas/meal.js');
var Pairing = require('./database/schemas/pairing.js');


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

// ###############################################################################################

app.post('/register', function (request, response) {
    const newUser = request.body;
    bcrypt.hash(newUser.password, 10).then(function(hashedPassword) {
        newUser.password = hashedPassword;
        User.create(newUser, function (err, data) {
            if (err || data === null) {
                // Query returned an error.
                console.error('/user error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (data.length === 0) {
                // Query didn't return an error but couldn't create the User object - this is also an internal error.
                response.status(400).send("Couldn't create user :/");
                return;
            }
            data.save();
            response.end(JSON.stringify(data));
        });
    }).catch(function(err) {
        console.error(err);
    });
});

app.post('/login', function (request, response) {
    const email = request.body.email;
    const password = request.body.password; 
    
    User.findOne({email: email}).select("_id first_name last_name dining_hall_id isDonor email password").exec(function (err, user) {
        bcrypt.compare(password, user.password).then(function(result) {
            if (result == false) {
                // Password was incorrect.
                console.log("Incorrect Password");
                response.status(400).send('Incorrect Password');
                return;
            }
            if (err || user === null) {
                // Query returned an error.
                console.error('/login error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (user.length === 0) {
                // Query didn't return an error but didn't find the User object - this is also an internal error.
                console.log("Couldn't find user");
                response.status(400).send('Missing User');
                return;
            }
            request.session.LOGGED_IN_USER = user;
            response.end(JSON.stringify({
                _id: user.id,
                isDonor: user.isDonor,
            }));
        });
    });
});

// Logs you in to the default recipient account (Alexis)
app.get('/login/recipient', function (request, response) {
    User.findOne({first_name: "Alexis", isDemoUser: true}).exec(function (err, user) {
        if (err || user === null) {
            // Query returned an error.
            console.error('/login/recipient error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user.length === 0) {
            // Query didn't return an error but didn't find the User object - this is also an internal error.
            console.log("Couldn't find user");
            response.status(400).send('Missing User');
            return;
        }

        request.session.LOGGED_IN_USER = user;
        console.log("\nLOGGED_IN_USER: " + request.session.LOGGED_IN_USER);
        response.end(JSON.stringify(user));
    });
});

// Logs you in to the default donor account (Nina)
app.get('/login/donor', function (request, response) {
    User.findOne({first_name: "Nina", isDemoUser: true}).exec(function (err, user) {
        if (err || user === null) {
            // Query returned an error.
            console.error('/login/donor error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user.length === 0) {
            // Query didn't return an error but didn't find the User object
            console.log("Couldn't find user");
            response.status(400).send('Missing User');
            return;
        }

        request.session.LOGGED_IN_USER = user;
        console.log("\nLOGGED_IN_USER: " + request.session.LOGGED_IN_USER);
        response.end(JSON.stringify(user));
    });
});

// Sets the current user's dining hall
app.post('/set/dining_hall', function (request, response) {
    if (request.body.name === "") {
        console.log('tried to set dining hall to none');
        response.status(400).send(JSON.stringify({}));
        return;
    }
    User.findOne({_id: request.session.LOGGED_IN_USER._id}).exec(function (err, user) {
        if (err) {
            // Query returned an error.
            console.log('Doing /set/dining_hall error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user.length === 0) {
            // Query didn't return an error but didn't find the object
            response.status(400).send('Missing User');
            return;
        }
        DiningHall.findOne({name: request.body.name}).exec(function (err, data) {
            if (err || !data) {
                // Query returned an error.
                console.log('Doing /set/dining_hall error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (data.length === 0) {
                // Query didn't return an error but didn't find the object
                response.status(400).send('Missing Hall');
                return;
            }

            user.dining_hall_id = data._id;
            user.save();
            // console.log(user);
            response.end(JSON.stringify(user));
        });

    });
});

// List all the dining halls
app.get('/list/dining_halls', function (request, response) {
    DiningHall.find({}).exec(function (err, data) {
        if (err) {
            // Query returned an error
            console.error('Doing /list/dining_hall error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (data.length === 0) {
            // Query didn't return an error but didn't find the objects
            response.status(400).send('Missing Dining Halls');
            return;
        }

        // We got the data - return them in JSON format
        response.end(JSON.stringify(data));
    });
});

// List all the users at a dining hall
app.get('/list/users/:dining_hall_id', function (request, response) {
    const dining_hall_id = request.params.dining_hall_id;
    
    User.find({dining_hall_id: dining_hall_id, isDonor: !request.session.LOGGED_IN_USER.isDonor}).exec(function (err, data) {
        if (err) {
            // Query returned an error
            console.error('Doing /list/users/:dining_hall_id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (data.length === 0) {
            // No one is at this dining hall
            // probably there's a more efficient way to do this query first and then filter for the above, but whatever
            if (request.session.LOGGED_IN_USER.isDemoUser) {
                User.find({isDemoUser: true, isDonor: !request.session.LOGGED_IN_USER.isDonor}).exec(function (err, data) {
                    if (err || data === null) {
                        // Query returned an error.
                        console.error('/list/users/:dining_hall_id error:', err);
                        response.status(400).send(JSON.stringify(err));
                        return;
                    }
                    response.end(JSON.stringify(data));
                });
                return;
            } else {
                response.status(400).send('Missing Dining Halls');
                return;
            }
        }
        console.log(data);
        // We got the data - return them in JSON format
        response.end(JSON.stringify(data));
    });
});

// List all the users the current user has paired with
app.get('/list/pairings', function (request, response) {
    // Where current user is either donor or recipient
    Pairing.find({ $or: [
            { donor: request.session.LOGGED_IN_USER },
            { recipient: request.session.LOGGED_IN_USER }
        ]}).exec(function (err, data) {
        if (err) {
            // Query returned an error
            console.error('Doing /list/pairings error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        // console.log(data);
        if (data.length === 0) {
            response.status(200).send('No Pairings');
            return;
        } else {
            // We got the data - return them in JSON format
            response.end(JSON.stringify(data));
        }
    });
});


// ###############################################################################################

/*
 * URL /user/list - Return all the User objects.
 */
app.get('/user/list', function (request, response) {
    // Don't send unless logged in
    if (!request.session.LOGGED_IN_USER) {
        response.status(401).send('Unauthorized!');
        return;
    }

    User.find({}).select("_id first_name last_name").exec(function (err, users) {
        if (err) {
            // Query returned an error.
            console.error('Doing /user/list error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (users.length === 0) {
            // Query didn't return an error but didn't find the User objects - this is also an internal error.
            response.status(400).send('Missing User');
            return;
        }

        // We got the Users - return them in JSON format.
        response.end(JSON.stringify(users));
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    // Don't send unless logged in
    if (!request.session.LOGGED_IN_USER) {
        response.status(401).send('Unauthorized!');
        return;
    }

    const id = request.params.id;
    User.findOne({_id: id}).select("_id first_name last_name location description occupation favorites").exec(function (err, user) {
        if (err) {
            // Query returned an error.
            console.error('Doing /user/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user.length === 0) {
            // Query didn't return an error but didn't find the User object - this is also an internal error.
            response.status(400).send('Missing User');
            return;
        }

        // We got the User - return them in JSON format.
        // console.log('User', user);
        response.end(JSON.stringify(user));
    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    // Don't load unless logged in
    if (!request.session.LOGGED_IN_USER) {
        response.status(401).send('Unauthorized!');
        return;
    }

    var id = request.params.id;
    Photo.find({user_id: id}).select("_id user_id comments file_name date_time likes").sort("-likes -date_time").exec(function (err, photos) {
        if (err) {
            // Query returned an error.
            console.error('Doing /photosOfUser/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (photos.length === 0) {
            // Query didn't return an error but didn't find the Photo objects - this is also an internal error.
            response.status(400).send('Missing Photos');
            return;
        }

        // Clone object, removing MongoDB restrictions
        let photosClone = JSON.parse(JSON.stringify(photos));

        // For each comment on each photo, get rid of user_id and add User object
        async.each(photosClone, function(photo, done_callback1) {
            async.each(photo.comments, function(comment, done_callback2) {
                User.findOne({_id: comment.user_id}).select("_id first_name last_name").exec(function (err2, user) {
                    if (err2) {
                        // Query returned an error.
                        console.error('Error getting user who posted comment:', err2);
                        response.status(400).send(JSON.stringify(err2));
                        return;
                    }
                    if (user.length === 0) {
                        // Query didn't return an error but didn't find the User object - this is also an internal error.
                        console.log("Didn't find user :/");
                        response.status(400).send('Missing User');
                        return;
                    }
                    comment.user = user;
                    delete comment.user_id;
                    done_callback2();
                });
            }).then(done_callback1);
        }).then(function() {
            // We got the Photos - return them in JSON format.
            response.end(JSON.stringify(photosClone));
        });
    });
});

app.post('/admin/login', function (request, response) {
    const login = request.body.login_name;
    const password = request.body.password;
    console.log();

    User.findOne({login_name: login}).select("_id first_name last_name location description occupation login_name password favorites").exec(function (err, user) {
        if (err || user === null) {
            // Query returned an error.
            console.error('/admin/login error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user.length === 0) {
            // Query didn't return an error but didn't find the User object - this is also an internal error.
            console.log("Couldn't find user");
            response.status(400).send('Missing User');
            return;
        }
        // allows the built-in users to use password "weak" though not in DB
        if (!(user.password === password || (!user.password && password === "weak"))) {
            console.log("incorrect password");
            response.status(400).send('Incorrect Password');
            return;
        }

        request.session.LOGGED_IN_USER = user;
        response.end(JSON.stringify(user));
    });
});

app.post('/admin/logout', function (request, response) {
    delete request.session.LOGGED_IN_USER;
    request.session.destroy(function (err) {
        console.log("/admin/logout error: ", err);
    } );
    response.redirect(200, '/login');
});

app.post('/commentsOfPhoto/:photo_id', function (request, response) {
    const photo_id = request.params.photo_id;
    const comment_obj = {
        comment: request.body.comment_text,
        user_id: request.session.LOGGED_IN_USER._id
    };

    Photo.findOne({_id: photo_id}).select("comments").exec(function (err, data) {
        if (err || data === null) {
            // Query returned an error.
            console.error('/commentsOfPhoto/:photo_id', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (data.length === 0) {
            // Query didn't return an error but didn't find the User object - this is also an internal error.
            response.status(400).send('Missing Photo');
            return;
        }
        data.comments.push(comment_obj);
        data.save();
        response.end(JSON.stringify(data));
    });
});

// shoutout to https://edstem.org/us/courses/16721/discussion/1234992?answer=2803800
app.post('/photos/new', function (request, response) {
    // can put some code for HTTP request auth handling here
    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            console.error('photos/new error: ', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }

        const timestamp = new Date().valueOf();
        const filename = 'U' +  String(timestamp) + request.file.originalname;

        fs.writeFile("./images/" + filename, request.file.buffer, function (err2) {
            if (err2) {
                console.log("/photos/new error: ", err2);
            }
          Photo.create({ file_name: filename, user_id: request.session.LOGGED_IN_USER._id}, function(err3, data) {
              if (err3 || data === null) {
                  // Query returned an error.
                  console.error('/photos/new', err3);
                  response.status(400).send(JSON.stringify(err3));
                  return;
              }
              if (data.length === 0) {
                  // Query didn't return an error but didn't create the object - this is also an internal error.
                  response.status(400).send('Unable to create photo');
                  return;
              }
              response.end(JSON.stringify(data));
          });
        });
    });
});

app.post('/user', function (request, response) {
    const newUser = request.body;

    User.create(newUser, function (err, data) {
        if (err || data === null) {
            // Query returned an error.
            console.error('/user error: ', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (data.length === 0) {
            // Query didn't return an error but couldn't create the User object - this is also an internal error.
            response.status(400).send("Couldn't create user :/");
            return;
        }
        data.save();
        response.end(JSON.stringify(data));
    });
});

// Get the list of users who liked a photo
app.get('/getLikes/:photo_id', function (request, response) {
    // Don't load unless logged in
    if (!request.session.LOGGED_IN_USER) {
        response.status(401).send('Unauthorized!');
        return;
    }

    const photo_id = request.params.photo_id;
    Photo.findOne({_id: photo_id}).select("likes").exec(function (err, data) {
        if (err || data === null) {
            // Query returned an error.
            console.error('/getLikes/:photo_id', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (data.length === 0) {
            // Query didn't return an error but didn't find the User object - this is also an internal error.
            response.status(400).send('Missing Photo');
            return;
        }
        response.end(JSON.stringify(data.length));
    });
});

// Add or remove a like for the selected photo
app.get('/clickLike/:photo_id', function (request, response) {
    // Don't load unless logged in
    if (!request.session.LOGGED_IN_USER) {
        response.status(401).send('Unauthorized!');
        return;
    }

    const photo_id = request.params.photo_id;
    Photo.findOne({_id: photo_id}).select("likes").exec(function (err, data) {
        if (err || data === null) {
            // Query returned an error.
            console.error('/clickLike/:photo_id', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (data.length === 0) {
            // Query didn't return an error but didn't find the User object - this is also an internal error.
            response.status(400).send('Missing Photo');
            return;
        }

        if (data.likes.includes(request.session.LOGGED_IN_USER._id)) {
            // They've already liked it, so remove from list
            data.likes.splice(data.likes.indexOf(request.session.LOGGED_IN_USER._id));
            data.save();
            // Return the text for the like button and the updated number of likes
            response.end(JSON.stringify({
                numLikes: data.likes.length,
                text: "Like",
            }));
        } else {
            // Add them to list
            data.likes.push(request.session.LOGGED_IN_USER._id);
            data.save();
            // Return the text for the like button and the updated number of likes
            response.end(JSON.stringify({
                numLikes: data.likes.length,
                text: "Dislike",
            }));
        }
    });
});

// Get the list of a user's favorite photos
app.get('/getFavorites/:id', function (request, response) {
    // Don't load unless logged in
    if (!request.session.LOGGED_IN_USER) {
        response.status(401).send('Unauthorized!');
        return;
    }

    const id = request.params.id;
    User.findOne({_id: id}).select("favorites").exec(function (err, data) {
        if (err || data === null) {
            // Query returned an error.
            console.error('/getFavorites/:id', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (data.length === 0) {
            // Query didn't return an error but didn't find the User object - this is also an internal error.
            response.status(400).send('Missing User');
            return;
        }

        // Clone object, removing MongoDB restrictions

        let favoritePhotos = [];
        // Get Photo objects bc more useful
        async.each(data.favorites, function(photoID, done_callback1) {
            Photo.findOne({_id: photoID}).exec(function (err2, photo) {
                if (err2) {
                    // Query returned an error.
                    console.error('Error getting photo by ID:', err2);
                    response.status(400).send(JSON.stringify(err2));
                    return;
                }
                if (photo.length === 0) {
                    // Query didn't return an error but didn't find the User object - this is also an internal error.
                    console.log("Didn't find photo :/");
                    response.status(400).send('Missing Photo');
                    return;
                }
                favoritePhotos.push(photo);
                done_callback1();
            });
        }).then(function() {
            // We got the Photos - return them in JSON format.
            response.end(JSON.stringify(favoritePhotos));
        });
    });
});

// Add or remove a favorite for the selected photo
app.get('/clickFavorite/:photo_id', function (request, response) {
    // Don't load unless logged in
    if (!request.session.LOGGED_IN_USER) {
        response.status(401).send('Unauthorized!');
        return;
    }

    const photo_id = request.params.photo_id;
    User.findOne({_id: request.session.LOGGED_IN_USER._id}).select("favorites").exec(function (err, data) {
        if (err || data === null) {
            // Query returned an error.
            console.error('/clickFavorite/:photo_id', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (data.length === 0) {
            // Query didn't return an error but didn't find the User object - this is also an internal error.
            response.status(400).send('Missing User');
            return;
        }

        if (data.favorites.includes(photo_id)) {
            // They've already favorited it, so remove from list
            data.favorites.splice(data.favorites.indexOf(photo_id));
            data.save();
            // Return the text for the favorite button
            response.end(JSON.stringify({
                text: "Favorite",
            }));
        } else {
            // Add them to list
            data.favorites.push(photo_id);
            data.save();
            // Return the text for the favorite button
            response.end(JSON.stringify({
                text: "Unfavorite",
            }));
        }
    });
});

// Get a user's (a) most recently uploaded and (b) most commented photos
app.get('/getTop/:id', function (request, response) {
    // Don't load unless logged in
    if (!request.session.LOGGED_IN_USER) {
        response.status(401).send('Unauthorized!');
        return;
    }

    const id = request.params.id;
    Photo.find({user_id: id}).select("date_time comments file_name").sort("-date_time").exec(function (err, photos) {
        if (err) {
            // Query returned an error.
            console.error('Doing /getTop/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (photos.length === 0) {
            // Query didn't return an error but didn't find the Photo objects - this is also an internal error.
            response.status(400).send('Missing Photos');
            return;
        }

        let top = {
            recent: photos[0]
        };
        let max = photos[0];
        let maxNum = 0;
        for (let i = 0; i < photos.length; i++) {
            if (photos[i].comments.length > maxNum) {
                max = photos[i];
                maxNum = photos[i].comments.length;
            }
        }
        top.mostComments = max;

        response.end(JSON.stringify(top));
    });
});



// ======================================================================

var server = app.listen(process.env.PORT, function () {
    var port = server.address().port;
    console.log("Listening at http://localhost:", port, " exporting the directory ", __dirname);
});
