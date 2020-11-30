const express  = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require("cors");

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

app.get("/", (req, res, next) => {
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

  res.render("mainView", {
     resultArray: winnersArray,
     differenceArray: differenceArray,
     losersArray: losersArray,
     findAllWinnerScores: findAllWinnerScores,
     findAllLoserScores: findAllLoserScores, 
     score: score, 
     maximumGameScore: maximumGameScore, 
     findTopMovePerPlayer: findTopMovePerPlayer,
     findMedianPerPlayer: findMedianPerPlayer, 
     findMedianPerMovePerPlayer: findMedianPerMovePerPlayer
  });
 });

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server is running at port`);
});
