const e = require("express");

module.exports = {

  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/
  /*--------- Player profile's functions ------------------*/
  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/
  findPlayerFromID: function (users, userID) {

    for (var i = 0; i < users.length; i++) {
      if (users[i]._id === userID) {
        return users[i];
      }
    }
    return null;
  },

  compare: function (player1, player2) { //Compare function in order to sort the scoreboard 
    if (player1.score < player2.score) {
      return 1;
    }
    if (player1.score > player2.score) {
      return -1;
    }
    return 0;
  },

  findTotalScoreSingleGameEachPlayer: function (total, num) {
    return total + num;
  },

  calculateStatsVsOpponent: function (posAllGamesStats, playersOpponents, gameOpponents) {

    for (var i = 1; i < posAllGamesStats.positions.length; i++) {
      playersOpponents.forEach(playersOpponent => {
        if ((gameOpponents[i - 1]._id != 0 && gameOpponents[i - 1]._id === playersOpponent._id) //Real players
          ||
          (gameOpponents[i - 1]._id === 0 && gameOpponents[i - 1].name === playersOpponent.name)) //Dummy names
        {
          if (posAllGamesStats.positions[0] - posAllGamesStats.positions[i] > 0) {
            playersOpponent.losses++;
          } else if (posAllGamesStats.positions[0] - posAllGamesStats.positions[i] === 0) {
            playersOpponent.ties++;
          } else {
            playersOpponent.victories++;
          }
          playersOpponent.opponentsStats.push(posAllGamesStats);
        }
      });
    }
  },

  findDifferencesSingleGame: function(scoreTable) {
    var differences = []; 
    /* Difference of player with himself/herself is always 0 */
    differences.push(0);

    for(var i=1; i<scoreTable.length; i++){
      differences.push(scoreTable[0] - scoreTable[i]);
    }
    
    return differences;
  },

  findGamesStats: function (gamesTable) {
    var returnedGames = [];

    gamesTable.forEach(game => {
      var tempGame = {
        _id: "",
        playersNames: [],
        scores: [],
        positions: [],
        diff: []
      }

      /* Store games IDs */
      tempGame._id = game._id;

      /* Store playersNames & calculate scores (always first players profile) */
      tempGame.playersNames.push("You");
      tempGame.scores.push(game.scores.reduce(this.findTotalScoreSingleGameEachPlayer));

      /* Store opponents names & scores */
      game.opponents.forEach(opponent => {
        tempGame.scores.push(opponent.scores.reduce(this.findTotalScoreSingleGameEachPlayer));
        tempGame.playersNames.push(opponent.name);
      })

      /* Calculate positions & store values */
      tempGame.positions = this.findPositionSingleGame(tempGame.scores);

      /* Calculate differences & store values */ 
      tempGame.diff = this.findDifferencesSingleGame(tempGame.scores);

      returnedGames.push(tempGame);
    });

    return returnedGames;
  },

  findPlayersGameStats: function (userdb, currentPlayer) {

    //Returned Struct
    var player = {
      positionStats: {
        pos1stats: [],
        pos2stats: [],
        pos3stats: [],
        pos4stats: [],
        posAllLosesStats: [],
        posAllGamesStats: []
      },
      opponents: []
    }

    //General Statistics
    /* 1.a Add games of current player */
    var games = [...currentPlayer.insertedGames];

    /* 1.b Add games of current player from friends games */
    currentPlayer.friends.forEach(friend => {
      userdb.forEach(user => {
        if (user._id === friend) {
          user.insertedGames.forEach(insertedGame => {
            for (var i = 0; i < insertedGame.opponents.length; i++) {
              if (insertedGame.opponents[i]._id === currentPlayer._id) {
                var insertGame = {
                  _id: insertedGame._id,
                  scores: insertedGame.opponents[i].scores,
                  opponents: [...insertedGame.opponents]
                }
                /* Replace player with opponent */
                insertGame.opponents.splice(i, 1, {
                  _id: user._id,
                  name: user.name,
                  scores: insertedGame.scores
                });
                games.push(insertGame);
              }
            }
          });
        }
      })
    });

    //2. Store all games stats 
    player.positionStats.posAllGamesStats = this.findGamesStats(games);

    //3. Store positions stats 
    player.positionStats.posAllGamesStats.forEach(gameStats => {
      switch (gameStats.positions[0]) {
        case 1: //Wins 
          player.positionStats.pos1stats.push(gameStats);
          player.opponents.pos
          break;
        case 2: //Second Positions & All losses 
          player.positionStats.pos2stats.push(gameStats);
          player.positionStats.posAllLosesStats.push(gameStats);
          break;
        case 3: //Third Positions & All losses
          player.positionStats.pos3stats.push(gameStats);
          player.positionStats.posAllLosesStats.push(gameStats);
          break;
        case 4: //Fourth Positions & All losses 
          player.positionStats.pos4stats.push(gameStats);
          player.positionStats.posAllLosesStats.push(gameStats);
          break;
        default:
          break;
      }
    });

    //4. Find all opponents (only friends appear & Dummy_names)

    //4.a Add all friends
    currentPlayer.friends.forEach(friend => {
      userdb.forEach(user => {
        if (user._id === friend) {
          var newOpponent = {
            _id: user._id,
            name: user.name,
            victories: 0,
            losses: 0,
            ties: 0,
            opponentsStats: []
          }
          player.opponents.push(newOpponent);
        }
      });
    });

    //4.b Add all dummy_names
    currentPlayer.dummyNames.forEach(dummyName => {
      var newOpponent = {
        _id: 0,
        name: dummyName,
        victories: 0,
        losses: 0,
        ties: 0,
        opponentsStats: []
      }
      player.opponents.push(newOpponent);
    });

    //5. Find Stats against each opponent
    games.forEach(game => {
      player.positionStats.posAllGamesStats.forEach(posAllGamesStats => {
        if (game._id === posAllGamesStats._id) {
          this.calculateStatsVsOpponent(posAllGamesStats, player.opponents, game.opponents);
        }
      });
    });

    //Find top 5 games 

    //Find least 5 games
    return player;
  },
  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/
  /*----- End of Player profile's functions ------*/
  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/


  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/
  /*--------specific game from database ----------*/
  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/

  /* Returns specific game from database */
  findSpecificGame: function (userdb, userID, gameID) {
    var wantedGame = null;
    var currentUser;

    //1. Find the user 
    for (let user of userdb) {
      if (user._id === userID) {
        currentUser = user;
        break;
      }
    }

    //2. Search in the inserted games 
    for (let game of currentUser.insertedGames) {
      if (game._id === gameID) {
        wantedGame = game;
        return wantedGame;
      }
    }
    //3. Search in the inserted games of friends 
    //For all friends 
    for (let friendID of currentUser.friends) {
      //Find friend in database 
      for (let user of userdb) {
        if (user._id === friendID) {
          //Search in friends games
          for (game of user.insertedGames) {
            if (game._id === gameID) {
              wantedGame = game;
              return wantedGame;
            }
          }
        }
      }
    }
  },

  /* Returns the position of players including Tie */
  findPositionSingleGame: function (scoreTable) {
    var positionSorted = [];
    var position = [];
    var currentPosition = 1;

    //1. Create a sorted copy of the initial table
    var scoreTableSorted = [...scoreTable];
    scoreTableSorted.sort(function (a, b) {
      return b - a
    });

    //2. Found the sorted positions of players. In case of tie, players are returned both as top position 
    for (var i = 0; i < scoreTableSorted.length; i++) {
      if (i === scoreTableSorted.length - 1) {
        positionSorted[i] = currentPosition;
        break;
      } else {
        if (scoreTableSorted[i] > scoreTableSorted[i + 1]) {
          positionSorted[i] = currentPosition;
          currentPosition++;
        } else if (scoreTableSorted[i] === scoreTableSorted[i + 1]) {
          //Tie 
          positionSorted[i] = currentPosition;
          positionSorted[i + 1] = currentPosition;
        } else {}
      }

    }

    //3. From sorted positions, create the unsorted position table. It is unsorted like the argument inserted.
    // example [500, 100, 200, 200] --> [1, 3, 2, 2]
    for (var j = 0; j < scoreTable.length; j++) {
      for (var i = 0; i < scoreTableSorted.length; i++) {
        if (scoreTableSorted[i] === scoreTable[j]) {
          position[j] = positionSorted[i];
          break;
        }
      }
    }

    return position;
  },

  /* Returns the top move of each player for single game */
  findTopMoveSingleGame: function (game) {
    var topMove = [];
    var tempTopMove = -1000;

    /* Find topmove for current player */
    game.scores.forEach(score => {
      if (score > tempTopMove) {
        tempTopMove = score;
      }
    });
    /* Store players top move  */
    topMove.push(tempTopMove);

    /* For each player find top move */
    game.opponents.forEach(opponent => {
      /* Reset top temporary top move */
      tempTopMove = -1000;
      opponent.scores.forEach(score => {
        if (score > tempTopMove) {
          tempTopMove = score;
        }
      });
      /* Store opponents top move */
      topMove.push(tempTopMove);
    });

    return topMove;
  },

  /* Returns the worst move of each player for single game */
  findWorstMoveSingleGame: function (game) {
    var worstMove = [];
    var tempWorstMove = 1000;

    /* Find worst move for current player */
    game.scores.forEach(score => {
      if (score < tempWorstMove && score >= 0) {
        tempWorstMove = score;
      }
    });
    /* Store players worst move  */
    worstMove.push(tempWorstMove);

    /* For each player find worst move */
    game.opponents.forEach(opponent => {
      /* Reset worst temporary worst move */
      tempWorstMove = 1000;
      opponent.scores.forEach(score => {
        if (score < tempWorstMove && score >= 0) {
          tempWorstMove = score;
        }
      });
      /* Store opponents worst move */
      worstMove.push(tempWorstMove);
    });

    return worstMove;
  },

  /* Returns the median per move of each player for single game */
  findMedianPerMoveSingleGame: function (game) {
    var medianPerMove = [];
    var tempMedianPerMove = 0;

    /* Find median per move for current player */
    game.scores.forEach(score => {
      tempMedianPerMove += score / game.scores.length;
    });
    tempMedianPerMove = tempMedianPerMove.toFixed(2);
    medianPerMove.push(tempMedianPerMove);

    /* For each player find median point per move */
    game.opponents.forEach(opponent => {
      tempMedianPerMove = 0;
      opponent.scores.forEach(score => {
        tempMedianPerMove += score / opponent.scores.length;
      });
      tempMedianPerMove = tempMedianPerMove.toFixed(2);
      medianPerMove.push(tempMedianPerMove);
    });

    return medianPerMove;
  },

  /* Returns players stats for single game */
  findGameStats: function (game) {

    var gameStats = {
      names: [],
      position: [],
      score: [],
      topSingleMove: [],
      worstSingleMove: [],
      medianPerMove: [],
      scores: []
    }

    /* Find names for each player */
    gameStats.names = this.findNamesSingleGame(game);

    /* Find scores for each player */ 
    gameStats.scores = this.findScoresPerRoundSingleGame(game);

    /* Find Score for each player */
    gameStats.score = this.findScoresTotalSingleGame(game);

    /* Find Position for each player */
    gameStats.position = this.findPositionSingleGame(gameStats.score);

    /* Find top move for each player */
    gameStats.topSingleMove = this.findTopMoveSingleGame(game);

    /* Find worst move for each player */
    gameStats.worstSingleMove = this.findWorstMoveSingleGame(game);

    /* Find median points per move for each player */
    gameStats.medianPerMove = this.findMedianPerMoveSingleGame(game);

    return gameStats;
  },

  findSumScoresPerRoundSingleGame: function (game) {

    var sumScores = [];
    var tempScore = [];

    /* Find sum score per round for current player */
    tempScore.push(game.scores[0]);
    for (var i = 1; i < game.scores.length; i++) {
      /* Sum rest of the values */
      var tempValue = tempScore[i - 1] + game.scores[i];
      tempScore.push(tempValue);
    }
    sumScores.push(tempScore);


    game.opponents.forEach(opponent => {
      tempScore = [];
      /* First values are the same */
      tempScore.push(opponent.scores[0]);
      for (var i = 1; i < opponent.scores.length; i++) {
        /* Sum rest of the values */
        var tempValue = tempScore[i - 1] + opponent.scores[i];
        tempScore.push(tempValue);
      }
      sumScores.push(tempScore);
    });

    return sumScores;
  },

  findScoresTotalSingleGame: function (game) {
    var scoreboard = [];

    //Find score for current player 
    scoreboard.push(game.scores.reduce(this.findTotalScoreSingleGameEachPlayer));

    //Find score of opponents
    game.opponents.forEach(opponent => {
      var score = 0;
      score = opponent.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      scoreboard.push(score);
    });

    return scoreboard;
  },

  findNamesSingleGame: function (game) {
    var names = []; 

    /* Store players name as you */
    names.push("You");

    /* Store opponents names */
    game.opponents.forEach(opponent => {
      names.push(opponent.name);
    });

    return names;
  }, 

  /* Returns the score per round for each player for single game */
  findScoresPerRoundSingleGame: function (game) {
    var scores = []; 

    /* Store players scores */
    scores.push(game.scores);

    /* Store opponents scores */
    game.opponents.forEach(opponent => {
      scores.push(opponent.scores);
    });

    return scores;
  }
  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/
  /*----- specific game from database ------*/
  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/

}