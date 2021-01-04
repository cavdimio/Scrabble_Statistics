require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require("cors");
const Chart = require("chart.js");
var $ = require("jquery");
const _ = require("lodash");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS;

const scrabble_lib = require("./scrabble_lib");

mongoose.connect("mongodb+srv://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@cluster0.db5ah.mongodb.net/" + process.env.MONGODB_COLLECTION_NAME + "?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const User = require("./backend/models/user");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

//Include public file for css
app.use(express.static(__dirname + "/public"));

var userId;

app.route("/")
  .get((req, res, next) => {
    res.render("home");
  });

app.route("/register")
  .get((req, res, next) => {
    res.render("register_page");
  })
  .post((req, res, next) => {

    /* Password encryption */
    //TODO convert all users in order to use bcrypt -------------------------
    // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    /* Create user */
    const newUser = new User({
      username: req.body.username,
      password: req.body.password, //hash, //TODO Insert hash when bcrypt is installed
      name: req.body.name,
      friends: [],
      dummyNames: [],
      insertedGames: [],
    });

    /* Save new user to the database */
    newUser.save(function (err) {
      if (err) {
        console.log(err);
        res.render("error_page"); //TODO more explainatory error message 
      } else {
        /* Find new user by username //TODO Change by email */ //TODO capitalize or small letters must become irrelevant 
        User.findOne({
          username: req.body.username
        }, (err, foundUser) => {
          if (err) {
            console.log(err);
            res.render("error_page"); //TODO more explainatory error message 
          } else {
            /* Go to new users page */
            res.redirect("/" + foundUser._id);
          }
        });
      }
    });
    //}
    //});
    //------End converting of all users------------------------------------------------------------

    //TODO Remember me functionality? 
    //TODO 3rd party authentication?
  });

app.route("/log-in")
  .get((req, res, next) => {
    res.render("login_page");
  })
  .post((req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
      username: username
    }, (err, foundUser) => {
      if (err) {
        /* Error happened during com */
        res.render("error_page"); //TODO more explainatory error message 
      } else {
        if (foundUser) {
          //TODO convert all users in order to use bcrypt --------------------
          // bcrypt.compare(password, foundUser.password, (err, result) => {
          //   if (result === true) {
          //     res.redirect("/" + foundUser._id);
          //   } else {
          //     /* Username exists but password is wrong */
          //     res.render("error_page"); //TODO more explainatory error message redirect to log-in?
          //   }
          // });
          //---------------------------End of Bcrypt ---------------------------

          //--------OLD implementation without Bcrypt --------------------------
          if (foundUser.password === password) {
            /* Go to new users page */
            res.redirect("/" + foundUser._id);
          } else {
            /* Username exists but password is wrong */
            res.render("error_page"); //TODO more explainatory error message redirect to log-in?
          }
          //-------End of old implementation without Bcrypt --------------------
        } else {
          /* Username doesn't exist */
          res.render("error_page"); //TODO more explainatory error message redirect to log-in?
        }
      }
    })

    //TODO Remember me functionality? 

    //TODO Go to my-new-profile page 

  });

app.route("/log-out")
  .get((req, res, next) => {
    //TODO Delete cookies & sessions here 
    res.redirect("/");
  });

app.route("/create-new-game")
  .get((req, res, next) => {
    res.render("create_new_game_page");
  });

app.route("/:id")
  .get((req, res, next) => {

    /* Find user */
    const userID = req.params.id;

    User.findById(userID, (error, player) => {
      if (error) {
        /* User doesn"t exist */
        res.render("error_page"); //TODO Perhaps more specific title about the error page 
      } else {
        /* Find friends */
        User.find()
          .where("_id")
          .in(player.friends)
          .exec(function (err, friends) {
            if (err) {
              /* No friends found, return blank table*/
              friends = [];
            } else {
              /* Friends found, no need for action: friends table used directly in findPlayersGameStats */
            }
            const findPlayersGameStats = scrabble_lib.findPlayersGameStats(player, friends);

            res.render("my_profile_page", {
              userID: userID,
              name: player.name,
              positionStats: findPlayersGameStats.positionStats,
              opponents: findPlayersGameStats.opponents,
            });
          });
      }
    });
  });

app.route("/game/:gameId")
  .get((req, res, next) => {

    const gameID = req.params.gameId;

    User.findById(userId, (error, player) => {
      if (error) {
        /* User wasn't found, return error page */
        res.render("error_page"); //TODO Perhaps more specific title about the error page 
      } else {

        /* First search for the game in users games */
        player.insertedGames.forEach(insertedGame => {
          if (String(insertedGame._id) === gameID) {
            /* Game found in users games */
            const currentGame = insertedGame;
            const gameStats = scrabble_lib.findGameStats(currentGame);
            const sumScoresPerRound = scrabble_lib.findSumScoresPerRoundSingleGame(currentGame);
            /* Go to game page */
            res.render("partials/single-game-stats", {
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
              res.render("error_page"); //TODO Perhaps more specific title about the error page 
            } else {

              /* Friends found, search for the game in friends inserted games*/
              friends.forEach(friend => {
                friend.insertedGames.forEach(insertedGame => {
                  if (String(insertedGame._id) === gameID) {
                    /* Game found in friends games */
                    const currentGame = insertedGame;
                    const gameStats = scrabble_lib.findGameStats(currentGame);
                    const sumScoresPerRound = scrabble_lib.findSumScoresPerRoundSingleGame(currentGame);
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
    userId = req.body.userID;
    res.redirect("/game/" + gameID);
  });

app.route("/error-page")
  .get((req, res, next) => {
    res.render("error_page");
  });

app.route("/test")
  .get((req, res, next) => {
    res.render("partials/test");
  });

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server is running at port`);
});