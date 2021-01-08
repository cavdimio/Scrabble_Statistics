const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
var $ = require("jquery");
const cors = require("cors");
const passport = require("passport");
const bcrypt = require("bcrypt");
const connection = require("./config/database");
//const MongoStore = require('connect-mongo')(session);
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
//TODO Session Setup

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
//TODO Session Passport 

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