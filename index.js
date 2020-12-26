require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require("cors");
const Chart = require('chart.js');
var $ = require('jquery');
const _ = require("lodash");
const mongoose = require('mongoose');

/* Dummy Databases */
//const userdb = require("./userdb");
/* TODO to be deleted   4) Find a way to hide the password here */

const scrabble_lib = require("./scrabble_lib");

/* Real databases */
mongoose.connect("mongodb+srv://"+ process.env.MONGODB_USERNAME +":"+ process.env.MONGODB_PASSWORD +"@cluster0.db5ah.mongodb.net/"+ process.env.MONGODB_COLLECTION_NAME +"?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, //unique --> deprecation schema 
  useFindAndModify: false
});

const User = require("./backend/models/user");

/* TODO Create real database here   ============= */
//How to save a user 
// const user1 = new User(
//   {
//     _id: "5fe706f450a0c923cc4248e5", //TODO unique username, email
//     username: "cavdimio",
//     password: "1234",
//     name: "Christos",
//     friends: ["5fe7084f5171b2305079020b", "5fe70a1576a1e33098738284", "5fe7094d9cd9d42ae8bcd959"],
//     dummyNames: ["MyDog", "MyGradma"],
//     insertedGames: [{
//             scores: [22, 18, 10, 10, 10, 36, 11, 23, 51, 6, 6, 26, 3, 6, 5, 2, -3, 12],
//             opponents: [{
//                     _id: "5fe7084f5171b2305079020b",
//                     name: "Konstantina",
//                     scores: [12, 9, 8, 10, 14, 7, 28, 5, 6, 9, 5, 2, 1, 1, 9, 1, 1, 12]
//                 },
//                 {
//                     _id: "5fe7094d9cd9d42ae8bcd959",
//                     name: "Thanos",
//                     scores: [23, 48, 69, 38, 49, 101, 11, 23, 11, 6, 6, -5, 3, 6, 5, 2, 1, 6]
//                 },
//                 {
//                     _id: "5fe70a1576a1e33098738284",
//                     name: "Afroditi",
//                     scores: [52, 58, 50, 50, 50, 56, 11, 23, 51, 6, 6, 26, 3, 6, 5, 2, 12, 0]
//                 },
//             ]
//         },
//         {
//             scores: [8, 10, 9, 15, 12, 15, 26, 34, 14, 9, 14, 26, 15, 7, 21, 12, 28, 7, 15, 6, 2],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [18, 19, 8, 42, 28, 12, 8, 9, 37, 12, 18, 10, 9, 12, 7, 8, 9, 7, 0]
//             },
//             {
//                 _id: 0,
//                 name: "MyDog",
//                 scores: [8, 10, 9, 15, 12, 15, 26, 34, 14, 9, 14, 26, 15, 7, 21, 12, 28, 7, 15, 6, 2]
//             },
//             {
//                 _id: 0,
//                 name: "MyGradma",
//                 scores: [52, 58, 50, 50, 50, 56, 11, 23, 51, 6, 6, 26, 3, 6, 5, 2, 12, 0]
//             }]
//         },
//         {
//             scores: [22, 28, 15, 17, 13, 27, 24, 13, 28, 18, 9, 18, 30, 24, 4, 16, 2, 3, 3],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [18, 19, 8, 42, 28, 12, 8, 9, 37, 12, 18, 10, 9, 12, 7, 8, 9, 7, 0]
//             }]
//         },
//         {
//             scores: [24, 30, 30, 5, 26, 25, 16, 8, 9, 10, 12, 15, 14, 16, 18, 15, 0, 0, -6],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [16, 9, 7, 14, 8, 8, 8, 3, 11, 14, 14, 12, 14, 7, 25, 8, 5, 6, 6]
//             }]
//         },
//         {
//             scores: [16, 26, 14, 21, 13, 26, 23, 20, 45, 21, 18, 7, 36, 14, 8, 13, 0, 0, 0, -2],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [15, 13, 9, 18, 14, 14, 5, 24, 9, 14, 15, 17, 5, 14, 9, 4, 5, 7, 2, 2]
//             }]
//         },
//         {
//             scores: [17, 24, 10, 8, 18, 13, 8, 13, 17, 9, 14, 46, 7, 12, 33, 10, 4, 4, 0, 0, -2],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [22, 22, 12, 8, 18, 24, 12, 7, 14, 34, 17, 12, 15, 5, 6, 13, 8, 4, 5, 10, -2]
//             }]
//         },
//         {
//             scores: [14, 20, 11, 30, 12, 7, 30, 17, 14, 12, 16, 12, 18, 7, 7, 12, 18, 6, -6],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [14, 4, 12, 18, 14, 22, 16, 6, 26, 9, 21, 24, 4, 2, 12, 5, 28, 0, -3]
//             }]
//         },
//         {
//             scores: [18, 8, 11, 12, 57, 22, 11, 14, 7, 84, 13, 6, 12, 9, 9, 11, 3, 10, 11, 10, 10, 0, 0, -5],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [36, 4, 6, 8, 20, 22, 24, 13, 7, 10, 16, 18, 9, 13, 6, 5, 3, 3, 20, 3, 6, 2, 2, -17]
//             }]
//         },
//         {
//             scores: [6, 14, 34, 16, 18, 30, 13, 11, 14, 21, 3, 16, 18, 11, 9, 14, 5, 0, -10],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [9, 10, 23, 34, 10, 12, 7, 18, 10, 14, 17, 14, 42, 9, 8, 7, 5, 3, 10]
//             }]
//         },
//         {
//             scores: [12, 18, 13, 9, 11, 10, 15, 28, 31, 6, 13, 16, 8, 18, 5, 21, 26, 24, 36, 2, 6, 2, 2],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [3, 18, 18, 14, 13, 13, 13, 16, 9, 16, 39, 7, 14, 24, 7, 13, 12, 4, 10, 4, 2, 0, -2]
//             }]
//         },
//         {
//             scores: [8, 14, 7, 11, 23, 19, 10, 20, 30, 36, 24, 24, 33, 21, 4],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [22, 16, 19, 14, 18, 10, 7, 28, 12, 17, 30, 24, 16, 6, -4]
//             }]
//         },
//         {
//             scores: [32, 14, 20, 12, 17, 14, 8, 24, 18, 26, 16, 18, 15, 23, 32, 8, 6],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [15, 6, 30, 14, 15, 13, 7, 17, 11, 9, 8, 26, 7, 12, 12, 0, -6]
//             }]
//         },
//         {
//             scores: [28, 32, 7, 20, 19, 20, 16, 10, 10, 20, 7, 21, 21, 21, 21, 17],
//             opponents: [{
//                 _id: "5fe7084f5171b2305079020b",
//                 name: "Konstantina",
//                 scores: [17, 36, 20, 30, 14, 51, 12, 60, 12, 22, 16, 16, 4, 15, 10, -1]
//             }]
//         },
//     ],
// }

// );
//user1.save();

// const user2 = new User(
//   {
//     _id: "5fe7084f5171b2305079020b",
//     username: "konst1",
//     password: "3456",
//     name: "Konstantina",
//     friends: ["5fe706f450a0c923cc4248e5", "5fe70a1576a1e33098738284", "5fe7094d9cd9d42ae8bcd959"],
//     dummyNames: ["Dad", "Mom"],
//     insertedGames: [{
//             scores: [23, 26, 45, 11, 5, 8, 12, 6, 7, 10, 12, 11, 12, 8, 3, 9, 8, 5, 0, 0, -10],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [14, 14, 30, 18, 9, 27, 20, 13, 12, 15, 11, 17, 15, 20, 24, 15, 14, 7, 7, 5, 10]
//             }]
//         },
//         {
//             scores: [16, 8, 7, 96, 20, 19, 14, 14, 15, 25, 41, 6, 11, 7, 8, 6, 0, -2],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [16, 27, 16, 15, 85, 33, 16, 11, 27, 13, 14, 15, 12, 27, 5, 5, 3, 2]
//             }, 
//             {
//                 _id: 0,
//                 name: "Dad",
//                 scores: [14, 14, 30, 18, 9, 27, 20, 13, 12, 15, 11, 17, 15, 20, 24, 15, 14, 7]
//             }]
//         },
//         {
//             scores: [11, 35, 30, 21, 14, 14, 14, 11, 21, 12, 23, 14, 3, 7],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [30, 16, 34, 20, 42, 27, 32, 42, 24, 18, 12, 12, 10, -7]
//             }]
//         },
//         {
//             scores: [6, 18, 12, 14, 26, 12, 18, 5, 28, 28, 16, 7, 15, 16, 9, 6, 3, 8, 0, -2],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [26, 16, 7, 6, 38, 8, 18, 42, 22, 36, 32, 16, 11, 45, 22, 6, 5, 4, 4, 2]
//             }]
//         },
//         {
//             scores: [16, 14, 48, 12, 18, 18, 13, 24, 30, 8, 16, 16, 15, 12, 3, -4],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [41, 34, 8, 24, 20, 11, 5, 39, 12, 34, 14, 15, 63, 9, 4, 4]
//             }]
//         },
//         {
//             scores: [28, 29, 56, 18, 26, 16, 14, 14, 6, 12, 9, 3, 6, 10, 6, 6, 4],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [61, 15, 14, 39, 13, 48, 12, 17, 30, 19, 28, 11, 21, 6, 6, 0, -4]
//             }]
//         },
//         {
//             scores: [16, 15, 36, 18, 16, 14, 7, 26, 20, 11, 12, 7, 14, 5, 6, 4, 5, 2, 0, -4],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [14, 14, 24, 28, 16, 11, 10, 7, 7, 54, 33, 12, 23, 14, 3, 2, 8, 6, 2, 4]
//             }]
//         },
//         {
//             scores: [8, 14, 20, 5, 8, 39, 13, 16, 11, 8, 8, 5, 6, 42, 16, 7, 6, 5, 4, 5, -5],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [34, 18, 36, 27, 50, 28, 14, 22, 21, 10, 9, 76, 15, 24, 33, 6, 4, 20, 3, 5, 5]
//             }]
//         },
//         {
//             scores: [20, 26, 11, 19, 8, 11, 2, 5, 14, 10, 10, 17, 15, 7, 24, 10, 6, 4, 3],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [12, 19, 36, 12, 9, 4, 6, 90, 18, 29, 16, 18, 18, 12, 15, 5, 0, 0, -3]
//             }]
//         },
//         {
//             scores: [74, 7, 28, 10, 16, 12, 17, 3, 2, 2, 5, 3, 28, 9, 4, 12, 2, 8, 5, 6, 0, 0, 0, -8],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [64, 28, 16, 14, 39, 14, 15, 8, 13, 16, 2, 6, 8, 12, 10, 10, 5, 7, 16, 8, 12, 8, 6, 8]
//             }]
//         },
//         {
//             scores: [5, 12, 9, 60, 14, 12, 30, 17, 14, 16, 4, 18, 37, 13, 6, 7, 0, -1],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [18, 18, 16, 15, 14, 13, 14, 12, 18, 29, 34, 21, 33, 12, 28, 9, 9, 1]
//             }]
//         },
//         {
//             scores: [9, 13, 14, 22, 6, 28, 15, 18, 4, 14, 26, 11, 14, 9, 15, 7, 2],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [12, 14, 13, 8, 18, 21, 34, 16, 21, 20, 29, 15, 45, 16, 14, 7, -2]
//             }]
//         },
//         {
//             scores: [10, 10, 20, 13, 3, 28, 36, 9, 10, 10, 15, 14, 14, 14, 5, 8, 5, -1],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [13, 8, 24, 42, 24, 20, 27, 28, 14, 51, 9, 32, 26, 14, 16, 7, 9, -1]
//             }]
//         },
//         {
//             scores: [40, 9, 11, 12, 30, 30, 17, 11, 8, 34, 9, 18, 8, 13, 8, 0, -3],
//             opponents: [{
//                 _id: "5fe706f450a0c923cc4248e5",
//                 name: "Christos",
//                 scores: [26, 25, 21, 14, 15, 22, 21, 13, 26, 26, 22, 6, 24, 12, 7, 4, 3]
//             }]
//         }
//     ]
// });

// user2.save();

// const user3 = new User({
//   _id: "5fe7094d9cd9d42ae8bcd959",
//   username: "thanis1",
//   password: "7890",
//   name: "Thanos",
//   friends: ["5fe7084f5171b2305079020b", "5fe706f450a0c923cc4248e5"],
//   dummyNames: [],
//   insertedGames: [],
// });

// user3.save();

// const user4 = new User({
//   _id: "5fe70a1576a1e33098738284",
//   username: "afroad",
//   password: "1357",
//   name: "Afroditi",
//   friends: ["5fe7084f5171b2305079020b", "5fe706f450a0c923cc4248e5"],
//   dummyNames: [],
//   insertedGames: [],
// });

// user4.save();

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
  const userID = req.params.id;

  User.findById(userID, (error, player) => {
    if (error) {
      /* User doesn't exist */
      res.render("error_page"); //TODO Perhaps more specific title about the error page 
    } else {

      /* Find friends */
      User.find()
        .where('_id')
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
  //-----End of  New implementation with database ---------

  //----- Old implementation without database ---------
  // /* Find user */
  // const userID = req.params.id;
  // const player = scrabble_lib.findPlayerFromID(userdb, userID);

  // /* Check if user exists */
  // if (player != null) {

  //   const friends = scrabble_lib.findFriends(userdb, player);
  //   const findPlayersGameStats = scrabble_lib.findPlayersGameStats(player, friends);

  //   res.render("my_profile_page", {
  //     userID: userID,
  //     name: player.name,
  //     positionStats: findPlayersGameStats.positionStats,
  //     opponents: findPlayersGameStats.opponents,
  //   });
  // } else {
  //   /* User doesn't exist */
  //   res.render("error_page");
  // }
  //-----End of Old implementation without database ---------
});

app.post("/game/:gameId", (req, res, next) => {
  const gameID = req.body.game_id;
  userId = req.body.userID;
  res.redirect("/game/" + gameID);
});

app.get("/game/:game_id", (req, res, next) => {

  //----- New implementation with database ---------
    const gameID = req.params.game_id;

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
          .where('_id')
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
  // //-----End of  New implementation with database ---------


  //----- Old implementation without database ---------
  // const gameID = req.params.game_id;

  // const currentGame = scrabble_lib.findSpecificGame(userdb, userId, gameID);

  // /* Check if game exists */
  // if (currentGame != null) {
  //   const gameStats = scrabble_lib.findGameStats(currentGame);
  //   const sumScoresPerRound = scrabble_lib.findSumScoresPerRoundSingleGame(currentGame);

  //   res.render("partials/single-game-stats", {
  //     gameStats: gameStats,
  //     sumScoresPerRound: sumScoresPerRound
  //   });
  // } else {
  //   /* Game doesn't exist */
  //   res.render("error_page");
  // }
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