const router = require('express').Router();
const passport = require('passport');
const connection = require('../config/database');
const bcrypt = require("bcrypt");
const statisticsCalculations = require("../lib/statisticsCalculations");
const User = connection.models.User;
const mongoose = require('mongoose');
const gameSchema = require("../models/game");
const {
  user
} = require('../config/database');

/**
 * -------------- GENERAL SETUP ----------------
 */
require('dotenv').config();


/**
 * -------------- ROUTES ----------------
 */
router.route("/")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      res.render("home", {
        loggedIn: req.isAuthenticated(),
        name: req.user.name
      });
    } else {
      res.render("home", {
        loggedIn: req.isAuthenticated(),
      });
    }
  });

router.route("/register")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      res.render("register_page", { //TODO logic of register in case it is already logged in
        loggedIn: req.isAuthenticated(),
        name: req.user.name
      });
    } else {
      res.render("register_page", {
        loggedIn: req.isAuthenticated(),
      });
    }
  })
  .post((req, res, next) => {

    const saltRounds = parseInt(process.env.SALT_ROUNDS);
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
    if (req.isAuthenticated()) {
      res.render("login_page", { //TODO logic of log-in in case it is already logged in
        loggedIn: req.isAuthenticated(),
        name: req.user.name
      });
    } else {
      res.render("login_page", {
        loggedIn: req.isAuthenticated(),
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
    if (req.isAuthenticated()) {
      res.render("create_new_game_page", {
        loggedIn: req.isAuthenticated(),
        name: req.user.name
      });
    } else {
      res.render("create_new_game_page", {
        loggedIn: req.isAuthenticated(),
      });
    }
  })
  .post((req, res, next) => {

    /* Create game */
    const Game = mongoose.model("Game", gameSchema); //TODO perhaps model should be extracted in models file
    const newInsertedGame = new Game({
      scores: [],
      opponents: []
    });

    /* Save number of opponents & number of rounds */
    var opponentsNumber = parseInt(req.body.OpponentsNum);
    var roundsNumber = parseInt(req.body.RoundsNum);
    var tempScores = [];

    /* Save players scores */
    for (var i = 0; i < roundsNumber; i++) {
      tempScores.push(parseInt(req.body.playersScoresRound[i]));
    }
    newInsertedGame.scores = tempScores;

    /* Save opponents & their scores */
    var tempOpponents = [];
    for (var i = 0; i < opponentsNumber; i++) {
      var tempOpponent = {
        _id: 0,
        name: "",
        scores: []
      }

      /* If opponent is one, req returns just a string whereas if more opponents the req returns an array of strings */
      if (opponentsNumber === 1) {
        tempOpponent.name = req.body.OpponentName;
      } else {
        tempOpponent.name = req.body.OpponentName[i];
      }

      /* Req returns scores of opponents mixed (per row), so necessary adjustment is below */
      for (j = i; j < req.body.OpponentsScores.length; j += opponentsNumber) {
        tempOpponent.scores.push(parseInt(req.body.OpponentsScores[j]));
      }
      /* Save the opponent */
      tempOpponents.push(tempOpponent);

      //Save the dummy name  //TODO Check if dummy name already exists //TODO Correct here when friends system is implemented
      req.user.dummyNames.push(tempOpponent.name);
    }
    newInsertedGame.opponents = tempOpponents;
    
    /* Save the inserted game */ 
    req.user.insertedGames.push(newInsertedGame);
    req.user.save(function (err) {
      if (err) {
        console.log(err);
        /* Error during saving */
        res.redirect("error-page"); //TODO more explainatory error message 
      } else {
        /* Go to profile page */
        res.redirect("profile");
      }
    });

  });

router.route("/profile")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
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
          res.render("my_profile_page", {
            loggedIn: req.isAuthenticated(),
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
              loggedIn: req.isAuthenticated(),
              userID: req.user._id,
              name: req.user.name,
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
                      loggedIn: req.isAuthenticated(),
                      userID: req.user._id,
                      name: req.user.name,
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
    if (req.isAuthenticated()) {
      res.render("error_page", {
        loggedIn: req.isAuthenticated(),
        name: req.user.name
      });
    } else {
      res.render("error_page", {
        loggedIn: req.isAuthenticated(),
      });
    }
  });

router.route("/test")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      res.render("partials/test", {
        loggedIn: req.isAuthenticated(),
        name: req.user.name
      });
    } else {
      res.render("partials/test", {
        loggedIn: req.isAuthenticated(),
      });
    }
  });

module.exports = router;