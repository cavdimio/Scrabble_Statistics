const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require("cors");
const Chart = require('chart.js');
var $ = require('jquery');
const _ = require("lodash");

/* Dummy Databases */
const userdb = require("./userdb")
const scrabble_lib = require("./scrabble_lib");

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

app.post("/game/:gameId", (req, res, next) => {
  const gameID = req.body.game_id;
  userId = req.body.userID;
  res.redirect("/game/" + gameID);
});

app.get("/game/:game_id", (req, res, next) => {
  const gameID = req.params.game_id;
  const currentGame = scrabble_lib.findSpecificGame(userdb, userId, gameID);

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
});

app.get("/error-page", (req, res, next) => {
  res.render("error_page");
});

app.get("/:id", (req, res, next) => {

  /* Find user */
  const userID = req.params.id;
  const player = scrabble_lib.findPlayerFromID(userdb, userID);

  /* Check if user exists */
  if (player != null) {
    const findPlayersGameStats = scrabble_lib.findPlayersGameStats(userdb, player);

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
});

app.get("/test", (req, res, next) => {
  res.render("partials/test");
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server is running at port`);
});