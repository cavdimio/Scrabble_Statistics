const passport = require('passport');
const bcrypt = require("bcrypt");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connection = require('./database');
const User = connection.models.User;
require('dotenv').config();

/*-------------Local Strategy -----------------------*/
const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};

passport.use("local", new LocalStrategy(customFields, (username, password, done) => {
    User.findOne({
            username: username
        })
        .then((user) => {
            if (!user) {
                return done(null, false)
            }
            bcrypt.compare(password, user.hash, (err, result) => {
                if (result === true) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        })
        .catch((err) => {
            done(err);
        });
}));

/*-------------Google Strategy -----------------*/
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    //   function(accessToken, refreshToken, profile, cb) {
    //     User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //       return cb(err, user);
    //     });
    //   }
    async function (accessToken, refreshToken, profile, done) {
        //check user table for anyone with a facebook ID of profile.id
        try {
            var user = await User.findOne({
                'google.id': profile.id
            });
        } catch {
            console.log("Error during searching"); //TODO return in case of error
            return done(err, user);
        }

        if (!user) {
            //new user
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.username,
                provider: 'facebook',
                //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                facebook: profile._json
            });
            user.save(function (err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //existing user 
            return done(err, user);
        }
    }
));

/*-------------Facebook Strategy -----------------*/








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