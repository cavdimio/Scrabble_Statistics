const express  = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require("cors");
const Chart = require('chart.js');
var $ = require('jquery');

const scrabbledb = require("./database");
const scrabble_lib = require("./scrabble_lib");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

//Include public file for css
app.use(express.static(__dirname + '/public'));


var numOfGame = 0;


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
  const findPlayersNames = scrabble_lib.findPlayersNames(scrabbledb , 0);
  
  res.render("scrabble_statistics", {
     resultArray: winnersArray,
     differenceArray: differenceArray,
     losersArray: losersArray,
     findAllWinnerScores: findAllWinnerScores,
     findAllLoserScores: findAllLoserScores, 
     score: score, 
     maximumGameScore: maximumGameScore, 
     findTopMovePerPlayer: findTopMovePerPlayer,
     findMedianPerPlayer: findMedianPerPlayer, 
     findMedianPerMovePerPlayer: findMedianPerMovePerPlayer, 
     findPlayersNames: findPlayersNames
  });

 });

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/single-game-stats", (req, res, next) => {
  const findSpecificStats = scrabble_lib.findSpecificStats(scrabbledb , numOfGame);
  // const findDiscrepancies = scrabble_lib.findDiscrepancies(scrabbledb);
  res.render("partials/single-game-stats", {
    findSpecificStats: findSpecificStats
  });
});

app.post("/single-game-stats",  (req, res, next) => {
  numOfGame = req.body.numOfGame;
  res.redirect("/single-game-stats");
});

app.get("/error-page", (req, res, next) => {
  res.render("error_page");
});

app.get("/test", (req, res, next) => {
  res.render("partials/test");
});

app.listen(process.env.PORT || 3000, function() { 
  console.log(`Server is running at port`);
});
