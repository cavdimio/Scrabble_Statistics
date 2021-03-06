const mongoose = require('mongoose');
const userSchema = require("../models/usersSchema");

require("dotenv").config();

const mongoDB = "mongodb+srv://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@cluster0.db5ah.mongodb.net/" + process.env.MONGODB_COLLECTION_NAME + "?retryWrites=true&w=majority";

const connection = mongoose.createConnection(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});


const User = connection.model("User", userSchema);

module.exports = connection;