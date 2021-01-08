const passport = require('passport');
const bcrypt = require("bcrypt");
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};

const verifyCallback = (username, password, done) => {

    User.findOne({ username: username })
        .then((user) => {

            if (!user) { return done(null, false) }

            bcrypt.compare(password, user.hash, (err, result) => {
                if (result === true) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });
        })
        .catch((err) => {   
            done(err);
        });
}

const strategy  = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});