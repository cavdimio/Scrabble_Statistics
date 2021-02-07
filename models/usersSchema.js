const mongoose = require("mongoose");  
const gameSchema = require("./gameSchema"); 

const userSchema = new mongoose.Schema({
    username: { type: String /*, /* required: true, unique: true  */ },
    email: String,
    hash: String,
    name:  String,
    insertedGames: [ gameSchema ],
    friends: [ String ],
    dummyNames: [ String ],
    requestSent: [ String ],
    requestReceived: [ String ],
    blockedList: [ String ]
  });

  module.exports = userSchema;