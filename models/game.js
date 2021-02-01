const mongoose = require("mongoose"); 

const gameSchema = new mongoose.Schema({
      scores: [Number],
      opponents: [{
        _id: String,
        name: String,
        scores: [Number]
      }]
  });

  module.exports = gameSchema;