const mongoose = require("mongoose");  //TODO insert into the program 

const userSchema = new mongoose.Schema({
    username: { type: String /*, /* required: true, unique: true  */ },
    password: { type: String /*, /* required: true */ },
    name:  String,
    friends: [String],
    dummyNames: [String],
    insertedGames: [new mongoose.Schema({
      scores: [Number],
      opponents: [{
        _id: String,
        name: String,
        scores: [Number]
      }]
    })]
  });

  module.exports = mongoose.model("User", userSchema);