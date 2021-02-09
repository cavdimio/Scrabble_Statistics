const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const {
  user
} = require("../config/database");
const gameSchema = require("./gameSchema");


/**
 * -------------- GENERAL SETUP ----------------
 */
require('dotenv').config();


const userSchema = new mongoose.Schema({
  username: {
    type: String /*, /* required: true, unique: true  */
  },
  email: String,
  hash: String,
  name: String,
  insertedGames: [gameSchema],
  friends: [String],
  dummyNames: [String],
  requestSent: [String],
  requestReceived: [String],
  blockedList: [String]
});


userSchema.plugin(encrypt, {
  secret: process.env.ENCRYPTION_KEY,
  encryptedFields: ['email']
});

module.exports = userSchema;