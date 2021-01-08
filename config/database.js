const mongoose = require('mongoose');

require("dotenv").config();

const mongoDB = "mongodb+srv://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@cluster0.db5ah.mongodb.net/" + process.env.MONGODB_COLLECTION_NAME + "?retryWrites=true&w=majority";

const connection = mongoose.createConnection(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const userSchema = new mongoose.Schema({
    username: {
        type: String /*, /* required: true, unique: true  */
    },
    password: {
        type: String /*, /* required: true */
    },
    name: String,
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

const User = connection.model("User", userSchema);

module.exports = connection;