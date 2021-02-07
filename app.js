const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
var $ = require("jquery");
const cors = require("cors");
const passport = require("passport");
const connection = require("./config/database");
const MongoStore = require('connect-mongo')(session);
var routes = require('./routes');

/**
 * -------------- GENERAL SETUP ----------------
 */
require('dotenv').config();

// Create the Express application
const app = express();

// Include public file for css
app.use(express.static(__dirname + "/public"));

// Set view engine 
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set cors for cors eror 
app.use(cors());

/**
 * -------------- SESSION SETUP ----------------
 */
const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session()); //TODO jwt session save 



/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- ERROR HANDLER ----------------
 */

 //TODO Error Handler 

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(process.env.PORT || 3000, function () {
    console.log(`Server is running at port`);
  });