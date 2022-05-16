# Meal Plan Underground
_CS 278, Spring 2022_

---

## Install
`npm install`   
`npm install -g nodemon`
<!-- `cd test && npm install mocha && cd ..` - Install before running test suite.   -->

## Environment
You will need to create a local `.env` file to run the app. This env file will be ignored by git.

**Create the .env file:**
```
touch .env
```

**Add the following variables to the .env file:**
```
MONGODB_URI="mongodb://localhost/meal-plan-underground"
PORT=3000
```


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
| `user_id` | string (primary key) | uuid | |
| `dining_hall_id` | string (foreign key) | uuid - dining hall the user is currently at |
| `photo_path` * | string (file path) | path to the user's profile photo | relative to `/static/images/profile-photos` |
| `swipes_remaining` * | integer | number of swipes the user currently has | we calculate this, but user can manually update to correct incorrect guesses |
| `is_donor` * | boolean | if the user is a donor (true) or recipient (false) _right now_ |  |
| `major` | string | required field |  |
| `biography` | string | short "about me" section |  |


### `Pairing` Table
| Column Name | Type | Meaning |
| - | - | - |
| `pairing_id` | string (primary key) | uuid - used to identify pairing |
| `donor_user_id` | User ID (foreign key) | uuid - one user in the pairing |
| `receiver_user_id` | User ID (foreign key) | uuid - ther user in the pairing |
| `meal_id` | uuid (foreign key) | which meal they got (breakfast, lunch, dinner) |
| `swipe_completed` | boolean | default to false, used for swipe tracking |
| `date_time` | datetime | when they got matched |

### `Meals` Table
_This table will be hardcoded for now._
| Column Name | Type | Meaning |
| - | - | - |
| `meal_id` | string (primary key) | uuid |
| `meal_category` | string | e.g. breakfast, lunch, dinner |

### `IceBreaker` Table
_This table will be hardcoded for now._

| Column Name | Type | Meaning |
| - | - | - |
| `ice_breaker_id` | string (primary key) | uuid |
| `ice_breaker` | string | the ice breaker question |


### `DiningHall` Table
_This table is hardcoded and never edited. See dining hall reference below for the current dining halls in the db._

| Column Name | Type | Meaning |
| - | - | - |
| `dining_hall_id` | string (primary key) | uuid |
| `dining_hall_name` | string | uuid |


| Dining Hall Reference |
| - |
| Arrillaga |
| EVGR |
| Wilbur |
| Stern |
| Branner |
| Casper |
| FloMo |
| Ricker |
| Lakeside |


---
## Routes (`webServer.js`)

### GET
| Path | Purpose |
| - | - |
| `/` | redirects to Stanford login or to `/map` |
| `/map` | shows the map view |
| `/pairings` | shows the user's lifetime pairings and links to the conversations |
| `/profile/{user_id}` | a user's profile |
| `/profile/edit/{user_id}` | an edit view for users to modify their own profile |


### POST
| Path | Purpose |
| - | - |
| `/set/user` | updates the user's information |
| `/set/pairing` | creates a pairing |

---
# Questions
* onboarding? do we need to explain the site?

---

Material UI Documentation: https://v4.mui.com/  

---

# Backend To Do
* guest swipes remaining
* lifetime donated
* lifetime received
* get list of people at a given dining hall rn
* get list of pairings
* create a pairing

probably not do:  
* switch to donate / receive


other to do:  
* cookies!
