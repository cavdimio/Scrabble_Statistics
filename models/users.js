const mongoose = require("mongoose");  
const gameSchema = require("./game"); 

const userSchema = new mongoose.Schema({
    username: { type: String /*, /* required: true, unique: true  */ },
    hash: String,
    name:  String,
    friends: [String],
    dummyNames: [String],
    insertedGames: [ gameSchema ]
  });

  module.exports = userSchema;