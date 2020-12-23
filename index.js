const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require("cors");
const Chart = require('chart.js');
var $ = require('jquery');
const _ = require("lodash");
const mongoose = require('mongoose');

/* Dummy Databases */
const userdb = require("./userdb"); //TODO to be deleted Local & remote databases to be created 
const scrabble_lib = require("./scrabble_lib");

/* Real databases */
mongoose.connect("mongodb://localhost:27017/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, //unique --> deprecation schema 
  useFindAndModify: false
});

const User = require("./backend/models/user");

/* TODO Create real database here   ============= */
//How to save a user 
// const user = new User({
//   username: "thanis1",
//   password: "7890",
//   name: "Thanos",
//   friends: [ "5fe330b2fa539316fcc9bff0", "5fe30cbb3e8e92284cfd2857"],
//   dummyNames: [],
//   insertedGames: []
// });

// user.save();
/* =================  End  ======================= */


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

//Include public file for css
app.use(express.static(__dirname + '/public'));

var userId;

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/:id", (req, res, next) => {

  //----- New implementation with database ---------
  /* Find user */
  // const userID = req.params.id;

  // User.findById(userID, (error, player) => {
  //   if (error) {
  //     /* User doesn't exist */
  //     res.render("error_page"); //TODO Perhaps more specific title about the error page 
  //   } else {

  //     /* Find friends */
  //     User.find()
  //       .where('_id')
  //       .in(player.friends)
  //       .exec(function (err, friends) {
  //         if (err) {
  //           /* No friends found, return blank table*/
  //           friends = [];
  //         } else {
  //           /* Friends found, no need for action: friends table used directly in findPlayersGameStats */
  //         }
  //         const findPlayersGameStats = scrabble_lib.findPlayersGameStats(player, friends);

  //         res.render("my_profile_page", {
  //           userID: userID,
  //           name: player.name,
  //           positionStats: findPlayersGameStats.positionStats,
  //           opponents: findPlayersGameStats.opponents,
  //         });
  //       });
  //   }
  // });
  //-----End of  New implementation with database ---------

  //----- Old implementation without database ---------
  // /* Find user */
  const userID = req.params.id;
  const player = scrabble_lib.findPlayerFromID(userdb, userID); //TODO To be replaced by database find user 

  /* Check if user exists */
  if (player != null) { // TODO <--- replace by database code

    //TODO Bring from database friends of user
    const friends = scrabble_lib.findFriends(userdb, player);
    const findPlayersGameStats = scrabble_lib.findPlayersGameStats(player, friends); //TODO insert directly friends table instead of userdb 

    res.render("my_profile_page", {
      userID: userID,
      name: player.name,
      positionStats: findPlayersGameStats.positionStats,
      opponents: findPlayersGameStats.opponents,
    });
  } else {
    /* User doesn't exist */
    res.render("error_page");
  }
  //-----End of Old implementation without database ---------
});

app.post("/game/:gameId", (req, res, next) => {
  const gameID = req.body.game_id;
  userId = req.body.userID;
  res.redirect("/game/" + gameID);
});

app.get("/game/:game_id", (req, res, next) => {

  //----- New implementation with database ---------
//   const gameID = req.params.game_id;

//   User.findById(userId, (error, player) => {
//     if (error) {
//       /* User wasn't found, return error page */
//       res.render("error_page"); //TODO Perhaps more specific title about the error page 
//     } else {

//       /* First search for the game in users games */
//       player.insertedGames.forEach(insertedGame => {
//         if (String(insertedGame._id) === gameID) {
//           /* Game found in users games */
//           const currentGame = insertedGame;
//           const gameStats = scrabble_lib.findGameStats(currentGame);
//           const sumScoresPerRound = scrabble_lib.findSumScoresPerRoundSingleGame(currentGame);
//           /* Go to game page */
//           res.render("partials/single-game-stats", {
//             gameStats: gameStats,
//             sumScoresPerRound: sumScoresPerRound
//           });
//         }
//       });

//       /* Secondly search game in users friends games */
//       /* Find friends */
//       User.find()
//         .where('_id')
//         .in(player.friends)
//         .exec(function (err, friends) {
//           if (err) {
//             /* No friends found, so game doesn't exist */
//             res.render("error_page"); //TODO Perhaps more specific title about the error page 
//           } else {

//             /* Friends found, search for the game in friends inserted games*/
//             friends.forEach(friend => {
//               friend.insertedGames.forEach(insertedGame => {
//                 if (String(insertedGame._id) === gameID) {
//                   /* Game found in friends games */
//                   const currentGame = insertedGame;
//                   const gameStats = scrabble_lib.findGameStats(currentGame);
//                   const sumScoresPerRound = scrabble_lib.findSumScoresPerRoundSingleGame(currentGame);
//                   /* Go to game page */
//                   res.render("partials/single-game-stats", {
//                     gameStats: gameStats,
//                     sumScoresPerRound: sumScoresPerRound
//                   });
//                 }
//               })
//             });
//           }
//         });
//     }
//   });
// //-----End of  New implementation with database ---------


  //----- Old implementation without database ---------
  const gameID = req.params.game_id;

  const currentGame = scrabble_lib.findSpecificGame(userdb, userId, gameID); //TODO replace with mongodb database 

  /* Check if game exists */
  if (currentGame != null) {
    const gameStats = scrabble_lib.findGameStats(currentGame);
    const sumScoresPerRound = scrabble_lib.findSumScoresPerRoundSingleGame(currentGame);

    res.render("partials/single-game-stats", {
      gameStats: gameStats,
      sumScoresPerRound: sumScoresPerRound
    });
  } else {
    /* Game doesn't exist */
    res.render("error_page");
  }
  //-----End of Old implementation without database ---------
});

app.get("/error-page", (req, res, next) => {
  res.render("error_page");
});

app.get("/test", (req, res, next) => {
  res.render("partials/test");
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server is running at port`);
});