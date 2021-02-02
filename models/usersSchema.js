const mongoose = require("mongoose");  
const gameSchema = require("./gameSchema"); 

const userSchema = new mongoose.Schema({
    username: { type: String /*, /* required: true, unique: true  */ },
    hash: String,
    name:  String,
    insertedGames: [ gameSchema ],
    friends: [mongoose.Schema.Types.ObjectId],
    dummyNames: [String],
    requestSent: [mongoose.Schema.Types.ObjectId],
    requestReceived: [mongoose.Schema.Types.ObjectId],
    blockedList: [mongoose.Schema.Types.ObjectId]
  });

  module.exports = userSchema;