const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require("cors");
const Chart = require('chart.js');
var $ = require('jquery');
const _ = require("lodash");

/* Dummy Databases */
const userdb = require("./userdb")
const scrabbledb = require("./gamedb");
const scrabble_lib = require("./scrabble_lib");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

//Include public file for css
app.use(express.static(__dirname + '/public'));

//var gameID;


app.get("/scrabble-statistics", (req, res, next) => {
  const winnersArray = scrabble_lib.findAllWinners(scrabbledb);
  const differenceArray = scrabble_lib.findAllDifferences(scrabbledb);
  const losersArray = scrabble_lib.findAllLosers(scrabbledb);
  const findAllWinnerScores = scrabble_lib.findAllWinnerScores(scrabbledb);
  const findAllLoserScores = scrabble_lib.findAllLoserScores(scrabbledb);
  const score = scrabble_lib.countAllWinners(scrabbledb);
  const maximumGameScore = scrabble_lib.countMaximumGameScoreForEachPlayer(scrabbledb);
  const findTopMovePerPlayer = scrabble_lib.findTopMovePerPlayer(scrabbledb);
  const findMedianPerPlayer = scrabble_lib.findMedianPerPlayer(scrabbledb);
  const findMedianPerMovePerPlayer = scrabble_lib.findMedianPerMovePerPlayer(scrabbledb);
  const findPlayersNames = scrabble_lib.findPlayersNames(scrabbledb, 0);

  res.render("scrabble_statistics", {
    resultArray: winnersArray,
    differenceArray: differenceArray,
    losersArray: losersArray,
    findAllWinnerScores: findAllWinnerScores,
    findAllLoserScores: findAllLoserScores,
    score: score, //TODO new implementation 
    maximumGameScore: maximumGameScore, //TODO new implementation
    findTopMovePerPlayer: findTopMovePerPlayer, //TODO new implementation
    findMedianPerPlayer: findMedianPerPlayer, //TODO new implementation
    findMedianPerMovePerPlayer: findMedianPerMovePerPlayer,
    findPlayersNames: findPlayersNames
  });

});

app.get("/", (req, res, next) => {
  res.render("home");
});

app.post("/game/:gameId", (req, res, next) => {
  const gameID = req.body.game_id;
  res.redirect("/game/" + gameID);
});

app.get("/game/:game_id", (req, res, next) => {
  const gameID = req.params.game_id;
  const currentGame = scrabble_lib.findSpecificGame(scrabbledb, gameID);

  /* Check if game exists */
  if (currentGame != null) {
    const gameStats = scrabble_lib.findGameStats(currentGame);
    res.render("partials/single-game-stats", {
      currentGame: currentGame,
      gameStats: gameStats
    });
  } else {
    /* Game doesn't exist */
    res.render("error_page");
  }
});

app.get("/error-page", (req, res, next) => {
  res.render("error_page");
});

app.get("/:id", (req, res, next) => {

  /* Find user */
  const userID = req.params.id;
  const findPlayersNameFromID = scrabble_lib.findPlayersNameFromID(userdb, userID);

  /* Check if user exists */
  if (findPlayersNameFromID != null) {
    const findPlayersGameStats = scrabble_lib.findPlayersGameStats(scrabbledb, userID);

    res.render("my_profile_page", {
      name: findPlayersNameFromID,
      positionStats: findPlayersGameStats.positionStats,
      opponents: findPlayersGameStats.opponents,
    });
  } else {
    /* User doesn't exist */
    res.render("error_page");
  }
});

app.get("/test", (req, res, next) => {
  res.render("partials/test");
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server is running at port`);
});