# CS142 Project 8: Photo App Sprint
_Steven G. Opferman | sopferman@stanford.edu_   
_CS 142, Winter 2022_

Project Spec: https://docs.google.com/document/d/1_IdShUHW-nsOwPoowoURdoAKOQwVPYFtMx4dhxt-D6w/edit#heading=h.nlaxd8mqaq0l

---
## Install
`npm install`   
`npm install -g nodemon`
`cd test && npm install mocha && cd ..` - Install before running test suite.  


## Running
`mongod --config /usr/local/etc/mongod.conf` - Starts the MongoDB server.  
`node loadDatabase.js` - This program loads the fake model data into the database.  
`npm run build:w` - Runs Webpack like the `run build` command except it invokes webpack with `--watch` so it will monitor the React components and regenerates the bundle if any of them change.  
`nodemon webServer.js` - Watch for any changes to the server code and automatically restart the web server. (You can restart it manually by typing the two character command `rs` at the nodemon command.)


## Testing
`npm run lint` - Runs ESLint on all the project's JavaScript files. The code you submit should run ESLint without warnings.  
`node loadDatabase.js; test/node_modules/.bin/mocha test/serverApiTest.js` - Runs the test suite for Problem 1
`node loadDatabase.js; test/node_modules/.bin/mocha test/sessionInputApiTest.js` - Runs the test suite for other problem, on a fresh load of the data  
`node loadDatabase.js; test/node_modules/.bin/mocha test/serverApiTest.js; node loadDatabase.js; test/node_modules/.bin/mocha test/sessionInputApiTest.js` - Run all the tests, refreshing the data before each
