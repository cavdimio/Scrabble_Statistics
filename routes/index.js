const router = require('express').Router();
const passport = require('passport');
const connection = require('../config/database');
const bcrypt = require("bcrypt");
const statisticsCalculations = require("../lib/statisticsCalculations");
const User = connection.models.User;


/**
 * -------------- GENERAL SETUP ----------------
 */
require('dotenv').config();


/**
 * -------------- ROUTES ----------------
 */
router.route("/")
  .get((req, res, next) => {
    if (req.user) {
      res.render("home", {
        loggedIn: true,
        name: req.user.name
      });
    } else {
      res.render("home", {
        loggedIn: false,
        name: undefined
      });
    }
  });

router.route("/register")
  .get((req, res, next) => {
    if (req.user) {
      res.render("register_page", { //TODO logic of register in case it is already logged in
        loggedIn: true,
        name: req.user.name
      });
    } else {
      res.render("register_page", {
        loggedIn: false,
      });
    }
  })
  .post((req, res, next) => {

    const saltRounds = parseInt(process.env.SALT_ROUNDS); //TODO Replace with environmental variable 
    /* Password encryption */
    //TODO convert all users in order to use bcrypt 
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) {
        console.log(err);
        res.redirect("error-page");
      } else {
        /* Create user */
        const newUser = new User({
          username: req.body.username,
          name: req.body.name,
          hash: hash,
          friends: [],
          dummyNames: [],
          insertedGames: [],
        });

        /* Save new user to the database */
        newUser.save(function (err) {
          if (err) {
            console.log(err);
            res.redirect("error-page"); //TODO more explainatory error message 
          } else {
            /* Find new user by username //TODO Change by email */ //TODO Use Lodash: capitalize or small letters must become irrelevant 
            User.findOne({
              username: req.body.username
            }, (err, foundUser) => {
              if (err) {
                console.log(err);
                res.redirect("error-page"); //TODO more explainatory error message 
              } else {
                /* Go to profile page */
                passport.authenticate('local')(req, res, function () {
                  res.redirect('/profile');
                });
              }
            });
          }
        });
      }
    });

    //TODO Remember me functionality? 
    //TODO 3rd party authentication?
  });

router.route("/log-in")
  .get((req, res, next) => {
    if (req.user) {
      res.render("login_page", { //TODO logic of log-in in case it is already logged in
        loggedIn: true,
        name: req.user.name
      });
    } else {
      res.render("login_page", {
        loggedIn: false,
      });
    }
  })
  .post(passport.authenticate("local", {
    failureRedirect: "/error-page",
    successRedirect: "/profile"
  }));

router.route("/log-out")
  .get((req, res, next) => {
    req.logout();
    res.redirect("/");
  });

router.route("/create-new-game")
  .get((req, res, next) => {
    if (req.user) {
      res.render("create_new_game_page", {
        loggedIn: true,
        name: req.user.name
      });
    } else {
      res.render("create_new_game_page", {
        loggedIn: false,
      });
    }
  })
  .post((req, res, next) => {
    console.log("I am here");
    //Find user
    //Add game 
    //Go to profile page 
    
  });

router.route("/profile")
  .get((req, res, next) => {
    if (req.user) {
      /* Find friends */
      User.find()
        .where("_id")
        .in(req.user.friends)
        .exec(function (err, friends) {
          if (err) {
            /* No friends found, return blank table*/
            friends = [];
          } else {
            /* Friends found, no need for action: friends table used directly in findPlayersGameStats */
          }
          const findPlayersGameStats = statisticsCalculations.findPlayersGameStats(req.user, friends);
          //console.log(req.user.name);
          res.render("my_profile_page", {
            loggedIn: true,
            userID: req.user._id,
            name: req.user.name,
            positionStats: findPlayersGameStats.positionStats,
            opponents: findPlayersGameStats.opponents,
          });
        });
    } else {
      res.redirect("error-page");
    }
  });

router.route("/game/:gameId")
  .get((req, res, next) => {

    const gameID = req.params.gameId;

    User.findById(req.user._id, (error, player) => {
      if (error) {
        /* User wasn't found, return error page */
        res.redirect("error-page"); //TODO Perhaps more specific title about the error page 
      } else {

        /* First search for the game in users games */
        player.insertedGames.forEach(insertedGame => {
          if (String(insertedGame._id) === gameID) {
            /* Game found in users games */
            const currentGame = insertedGame;
            const gameStats = statisticsCalculations.findGameStats(currentGame);
            const sumScoresPerRound = statisticsCalculations.findSumScoresPerRoundSingleGame(currentGame);
            /* Go to game page */
            res.render("partials/single-game-stats", {
              loggedIn: true,
              userID: req.user._id,
              gameStats: gameStats,
              sumScoresPerRound: sumScoresPerRound
            });
          }
        });

        /* Secondly search game in users friends games */
        /* Find friends */
        User.find()
          .where("_id")
          .in(player.friends)
          .exec(function (err, friends) {
            if (err) {
              /* No friends found, so game doesn't exist */
              res.redirect("error-page"); //TODO Perhaps more specific title about the error page 
            } else {

              /* Friends found, search for the game in friends inserted games*/
              friends.forEach(friend => {
                friend.insertedGames.forEach(insertedGame => {
                  if (String(insertedGame._id) === gameID) {
                    /* Game found in friends games */
                    const currentGame = insertedGame;
                    const gameStats = statisticsCalculations.findGameStats(currentGame);
                    const sumScoresPerRound = statisticsCalculations.findSumScoresPerRoundSingleGame(currentGame);
                    /* Go to game page */
                    res.render("partials/single-game-stats", {
                      gameStats: gameStats,
                      sumScoresPerRound: sumScoresPerRound
                    });
                  }
                })
              });
            }
          });
      }
    });
  })
  .post((req, res, next) => {
    const gameID = req.body.game_id;
    userId = req.user._id;
    res.redirect("/game/" + gameID);
  });

router.route("/error-page")
  .get((req, res, next) => {
    if (req.user) {
      res.render("error_page", {
        loggedIn: true,
        name: req.user.name
      });
    } else {
      res.render("error_page", {
        loggedIn: false,
      });
    }
  });

router.route("/test")
  .get((req, res, next) => {
    if (req.user) {
      res.render("partials/test", {
        loggedIn: true,
        name: req.user.name
      });
    } else {
      res.render("partials/test", {
        loggedIn: false,
      });
    }
  });

module.exports = router;