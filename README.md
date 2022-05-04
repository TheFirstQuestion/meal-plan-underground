# Meal Plan Underground
_CS 278, Spring 2022_

---
## Install
`npm install`   
`npm install -g nodemon`
<!-- `cd test && npm install mocha && cd ..` - Install before running test suite.   -->


## Running
`mongod --config /usr/local/etc/mongod.conf` - Starts the MongoDB server.  
`npm run build:w` - Runs Webpack like the `run build` command except it invokes webpack with `--watch` so it will monitor the React components and regenerates the bundle if any of them change.  
`nodemon webServer.js` - Watch for any changes to the server code and automatically restart the web server. (You can restart it manually by typing the two character command `rs` at the nodemon command.)
<!-- `node loadDatabase.js` - This program loads the fake model data into the database.   -->


## Testing
`npm run lint` - Runs ESLint on all the project's JavaScript files.
<!-- `node loadDatabase.js; test/node_modules/.bin/mocha test/serverApiTest.js` - Runs the test suite for Problem 1  
`node loadDatabase.js; test/node_modules/.bin/mocha test/sessionInputApiTest.js` - Runs the test suite for other problem, on a fresh load of the data  
`node loadDatabase.js; test/node_modules/.bin/mocha test/serverApiTest.js; node loadDatabase.js; test/node_modules/.bin/mocha test/sessionInputApiTest.js` - Run all the tests, refreshing the data before each -->

---
## Data Organization (`/schema/*`)
This assumes that the messaging will happen externally (i.e. email). Would need some more tables and routes for that lol

### `User` Table
_Data is initially pulled from Stanford's system, but the user can update certain fields, denoted by *_

| Column Name | Type | Meaning | Notes |
| - | - | - | - |
| `SUNet` | string (primary key) | SUNet id | never shown to users, only used internally |
| `first_name` * | string | first name |  |
| `last_name` * | string| last name |  |
| `email` * | string (email address) | user's email address | assumed initially to be SUNet@stanford.edu, but user can update |
| `photo_path` * | string (file path) | path to the user's profile photo | relative to `/static/images/profile-photos` |
| `swipes` * | integer | number of swipes the user currently has | we calculate this, but user can manually update to correct incorrect guesses |
| `isDonor` * | boolean | if the user is a donor (true) or recipient (false) _right now_ |  |
| `lifetime_donated` | integer | the total number of swipes the user has ever donated |  |
| `lifetime_received` | integer | the total number of swipes the user has ever received |  |


### `Pairing` Table
| Column Name | Type | Meaning |
| - | - | - |
| `id` | integer (primary key) | used to identify pairing |
| `person_1` | User ID | one user in the pairing |
| `person_2` | User ID | other user in the pairing |
| `location` | DiningHall ID | place where the pair is getting their meal |
| `meal` | Meal ID | meal that the pair is getting |


### `DiningHall` Table
_This table is hardcoded and never edited._

| id | Name |
| - | - |
| 1 | Arrillaga |
| 2 | EVGR |
| 3 | Wilbur |
| 4 | Stern |
| 5 | Branner |
| 6 | Casper |
| 7 | FloMo |
| 8 | Ricker |
| 9 | Lakeside |


### `Meal` Table
_This table is hardcoded and never edited._  

| id | Name |
| - | - |
| 1 | Breakfast |
| 2 | Lunch |
| 3 | Dinner |
| 4 | Brunch |

---
## Routes (`webServer.js`)

### GET
| Path | Purpose |
| - | - |
| `/` | redirects to Stanford login or to `/map` |
| `/map` | shows the map view |
| `/pairings` | shows the user's lifetime pairings and links to the conversations |
| `/profile` | shows the user's profile and allows them to edit it |

### POST
| Path | Purpose |
| - | - |
| `/set/user` | updates the user's information |
| `/set/pairing` | creates a pairing |

---
# Questions
* onboarding? do we need to explain the site?
