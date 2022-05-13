/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch their reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

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

// Load the Mongoose schema for User, Photo, and SchemaInfo
// var User = require('./schema/user.js');
// var Photo = require('./schema/photo.js');
// var SchemaInfo = require('./schema/schemaInfo.js');

mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));


app.get('/', function (request, response) {
    response.send('Simple web server of files from '.join(__dirname));
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    // console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - this is also an internal error.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            // console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections, we need to do an async call to each collection. That is tricky to do, so we use the async package do the work. We put the collections into array and use async.each to do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we don't understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});


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

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log("Listening at http://localhost:", port, " exporting the directory ", __dirname);
});
