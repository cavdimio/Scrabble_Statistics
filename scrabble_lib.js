const e = require("express");

module.exports = {

  findPlayersNames: function (gameTable, index) {
    var resultArray = [, ];
    resultArray[0] = gameTable[index].players[0].name;
    resultArray[1] = gameTable[index].players[1].name;
    return resultArray;
  },

  findTop5SingleGame: function (player) {
    var topplays = player.scores.sort((a, b) => b - a).slice(0, 5);
    return topplays;
  },

  findTopScoreSingleGame: function (game) {

    var topScorer = {
      name: "",
      topScore: 0
    }

    var p1Top = this.findTop5SingleGame(game.players[0]);
    var p2Top = this.findTop5SingleGame(game.players[1]);

    if (p1Top[0] > p2Top[0]) {
      topScorer = {
        name: game.players[0].name,
        topScore: p1Top[0]
      };
    } else if (p2Top[0] > p1Top[0]) {
      topScorer = {
        name: game.players[1].name,
        topScore: p2Top[0]
      };
    } else {
      if (p1Top[1] > p2Top[1]) {
        topScorer = {
          name: game.players[0].name,
          topScore: p1Top[1]
        };
      } else if (p2Top[1] > p1Top[1]) {
        topScorer = {
          name: game.players[1].name,
          topScore: p2op[1]
        };
      }
    }

    return topScorer;
  },



  findWinner: function (game) {
    const score1 = game.players[0].scores.reduce(this.findTotalScoreSingleGameEachPlayer);
    const score2 = game.players[1].scores.reduce(this.findTotalScoreSingleGameEachPlayer);

    if (score1 > score2) {
      return game.players[0].name;
    } else if (score2 > score1) {
      return game.players[1].name;
    } else
      return "It's a tie!";
  },

  findLoser: function (game) {
    const score1 = game.players[0].scores.reduce(this.findTotalScoreSingleGameEachPlayer);
    const score2 = game.players[1].scores.reduce(this.findTotalScoreSingleGameEachPlayer);

    if (score1 > score2) {
      return game.players[1].name;
    } else if (score2 > score1) {
      return game.players[0].name;
    } else
      return "It's a tie!";
  },

  findAllWinners: function (gameTable) {
    var resultArray = [];
    gameTable.forEach(element => {
      resultArray.push(this.findWinner(element));
    });
    return resultArray;
  },

  countAllWinners: function (gameTable) {
    var resultArray = [0, 0];
    gameTable.forEach(element => {
      if (this.findWinner(element) === element.players[0].name) {
        resultArray[0]++;
      } else if (this.findWinner(element) === element.players[1].name) {
        resultArray[1]++;
      } else {}
    });
    return resultArray;
  },

  countMaximumGameScoreForEachPlayer: function (gameTable) {
    var resultArray = [-1, -1];
    gameTable.forEach(element => {
      const scoreOfPlayer1CurrentGame = element.players[0].scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      const scoreOfPlayer2CurrentGame = element.players[1].scores.reduce(this.findTotalScoreSingleGameEachPlayer);

      if (resultArray[0] < scoreOfPlayer1CurrentGame) {
        resultArray[0] = scoreOfPlayer1CurrentGame;
      } else if (resultArray[1] < scoreOfPlayer2CurrentGame) {
        resultArray[1] = scoreOfPlayer2CurrentGame;
      } else {}
    });
    return resultArray;
  },

  findAllWinnerScores: function (gameTable) {

    var resultArray = [];
    gameTable.forEach(element => {
      var score1 = element.players[0].scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      var score2 = element.players[1].scores.reduce(this.findTotalScoreSingleGameEachPlayer);

      if (score1 > score2) {
        resultArray.push(score1);
      } else {
        resultArray.push(score2);
      }
    });
    return resultArray;
  },

  findAllLoserScores: function (gameTable) {
    var resultArray = [];
    gameTable.forEach(element => {
      var score1 = element.players[0].scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      var score2 = element.players[1].scores.reduce(this.findTotalScoreSingleGameEachPlayer);

      if (score1 > score2) {
        resultArray.push(score2);
      } else {
        resultArray.push(score1);
      }
    });
    return resultArray;
  },

  findAllLosers: function (gameTable) {
    var resultArray = [];
    gameTable.forEach(element => {
      resultArray.push(this.findLoser(element));
    });
    return resultArray;
  },

  findAllDifferences: function (gameTable) {
    var differenceArray = [];
    gameTable.forEach(element => {
      const score1 = element.players[0].scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      const score2 = element.players[1].scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      differenceArray.push(Math.abs(score1 - score2));
    });
    return differenceArray;
  },

  findTopMovePerPlayer: function (gameTable) {
    var resultArray = [-1, -1];

    gameTable.forEach(element => {
      element.players[0].scores.forEach(el => {
        if (resultArray[0] < el) {
          resultArray[0] = el;
        }
      });
      element.players[1].scores.forEach(el => {
        if (resultArray[1] < el) {
          resultArray[1] = el;
        }
      });
    });
    return resultArray;
  },

  findMedianPerPlayer: function (gameTable) {
    var resultArray = [0, 0];
    var temp1 = 0;
    var temp2 = 0;
    gameTable.forEach(element => {
      temp1 += element.players[0].scores.reduce(this.findTotalScoreSingleGameEachPlayer) / gameTable.length;
      temp2 += element.players[1].scores.reduce(this.findTotalScoreSingleGameEachPlayer) / gameTable.length;
    });
    resultArray[0] = temp1.toFixed(2);
    resultArray[1] = temp2.toFixed(2);
    return resultArray;
  },

  findMedianPerMovePerPlayer: function (gameTable) {
    var resultArray = [0, 0];
    var temp1 = 0;
    var temp2 = 0;
    gameTable.forEach(element => {
      element.players[0].scores.forEach((el, index) => {
        temp1 += (el / (element.players[0].scores.length * gameTable.length));
        temp2 += (element.players[1].scores[index] / (element.players[0].scores.length * gameTable.length));
      });
    });

    resultArray[0] = temp1.toFixed(2);
    resultArray[1] = temp2.toFixed(2);
    return resultArray;
  },
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

  findSortedScoreBoard: function (game) {

    /* Returned information: array of elements { _id: id of player, score: total score of player}*/
    var scoreboard = [];

    game.players.forEach(element => {
      var score = 0;
      var _id = null;
      if (element.scores != null) {
        score = element.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
        _id = element._id;
      }

      scoreboard.push({
        _id,
        score
      });
    });
    //Sort players depend on score (bigger first)
    scoreboard.sort(this.compare);

    return scoreboard;
  },

  calculateDiffs: function (playersPosition, scoreboard) {
    var diff = [null, null, null];

    switch (playersPosition) {

      case 0:
        /* Player is in 1st position*/
        /* Calculate difference with 2nd player : Definitely exists since at least 2 players */
        diff[0] = scoreboard[0].score - scoreboard[1].score;
        /* Check if 3rd player exists */
        if (scoreboard[2]._id != null) {
          /* Calculate difference with 3rd player*/
          diff[1] = scoreboard[0].score - scoreboard[2].score;
        }
        /* Check if 4th player exists*/
        if (scoreboard[3]._id != null) {
          /* Calculate difference with 4th player */
          diff[2] = scoreboard[0].score - scoreboard[3].score;
        }
        break;
      case 1:
        /* Player is in 2st position*/
        /* Calculate difference with 1st player; Definitely exists since at least 2 players; Difference always positive */
        diff[0] = scoreboard[0].score - scoreboard[1].score;
        if (scoreboard[2]._id != null) {
          diff[1] = scoreboard[1].score - scoreboard[2].score;
        }
        if (scoreboard[3]._id != null) {
          diff[2] = scoreboard[1].score - scoreboard[3].score;
        }
        break;
      case 2:
        /* Player is in 3rd position*/
        /* Calculate difference with 1st & 2nd player; Previous players definitely exist; Difference always positive */
        diff[0] = scoreboard[0].score - scoreboard[2].score;
        diff[1] = scoreboard[1].score - scoreboard[2].score;
        if (scoreboard[3]._id != null) {
          diff[2] = scoreboard[2].score - scoreboard[3].score;
        }
        break;
      case 3:
        /* Player is in 4th position*/
        /* Calculate difference with all players; Previous players definitely exist; Difference always positive */
        diff[0] = scoreboard[0].score - scoreboard[3].score;
        diff[1] = scoreboard[1].score - scoreboard[3].score;
        diff[2] = scoreboard[2].score - scoreboard[3].score;
        break;
      default:
        break;
    }
    return diff;
  },

  IsNewOpponent: function (opponents, currentID) {
    var IsNewOpponent = true;

    opponents.forEach(el => {
      if (currentID === el._id) {
        IsNewOpponent = false;
      }
    });

    return IsNewOpponent;
  },

  calculateStatsVsOpponent: function (posAllGamesStats, playersOpponents, gameOpponents) {

    for (var i = 1; i < posAllGamesStats.positions.length; i++) {
        playersOpponents.forEach(playersOpponent => {
          if ((gameOpponents[i-1]._id != 0 && gameOpponents[i-1]._id === playersOpponent._id) //Real players
            ||
            (gameOpponents[i-1]._id === 0 && gameOpponents[i-1].name === playersOpponent.name)) //Dummy names
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

  findScoresSingleGame: function (game) {
    var scoreboard = [];

    game.players.forEach(element => {
      var score = 0;
      if (element.scores != null) {
        score = element.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      }
      scoreboard.push(score);
    });

    return scoreboard;
  },

  opponentAddGames: function (playerID, opponents, game) {
    game.players.forEach(player => {
      if (player._id != null && player._id != playerID) {
        opponents.forEach(opponent => {
          if (opponent._id === player._id) {
            opponent.opponentsStats.games.push(game);
            opponent.opponentsStats.scores.push(this.findScoresSingleGame(game));
          }
        })
      }
    });
  },

  findGamesStats: function (gamesTable) {

    var returnedGames = [];

    gamesTable.forEach(game => {

      var tempGame = {
        ID: "",
        playersNames: [],
        scores: [],
        positions: [],
        //diff: [] //TODO Implementation of differences if needed
      }

      //Store games IDs
      tempGame.ID = game._id;

      //Store playersNames & calculate scores (always first players profile)
      tempGame.playersNames.push("You");
      tempGame.scores.push(game.scores.reduce(this.findTotalScoreSingleGameEachPlayer));

      //Store opponents names & scores
      game.opponents.forEach(opponent => {
        tempGame.scores.push(opponent.scores.reduce(this.findTotalScoreSingleGameEachPlayer));
        tempGame.playersNames.push(opponent.name);
      })

      //Calculate positions & store values
      tempGame.positions = this.findPositionSingleGame(tempGame.scores);

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
        if (game._id === posAllGamesStats.ID) {
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
  findSpecificGame: function (gameTable, index) {
    var resultGame = null;
    gameTable.forEach(game => {
      if (game._id === index) {
        resultGame = game;
      }
    });
    return resultGame;
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
    var topMove = [-100, -100, -100, -100];
    var currentPlayer = 0;

    /* For each player find top move */
    game.players.forEach(player => {
      if (player.name != null) { //Calculate only if player exists 
        player.scores.forEach(score => {
          if (topMove[currentPlayer] < score) {
            topMove[currentPlayer] = score;
          }
        });
      }
      /* Proceed to the next player  */
      currentPlayer++;
    });

    return topMove;
  },

  /* Returns the worst move of each player for single game */
  findWorstMoveSingleGame: function (game) {
    var worstMove = [1000, 1000, 1000, 1000];
    var currentPlayer = 0;

    /* For each player find top move */
    game.players.forEach(player => {
      if (player.name != null) { //Calculate only if player exists 
        player.scores.forEach(score => {
          if (score >= 0 && score < worstMove[currentPlayer]) {
            worstMove[currentPlayer] = score;
          }
        });
      }
      /* Proceed to the next player */
      currentPlayer++;
    });

    return worstMove;
  },

  /* Returns the median per move of each player for single game */
  findMedianPerMoveSingleGame: function (game) {
    var medianPerMove = [0, 0, 0, 0];
    var currentPlayer = 0;

    /* For each player find median point per move */
    game.players.forEach(player => {
      if (player.name != null) { //Calculate only if player exists
        player.scores.forEach(score => {
          medianPerMove[currentPlayer] += score / player.scores.length;
        });
      }
      /* Proceed to the next player */
      currentPlayer++;
    });

    medianPerMove[0] = medianPerMove[0].toFixed(2);
    medianPerMove[1] = medianPerMove[1].toFixed(2);
    medianPerMove[2] = medianPerMove[2].toFixed(2);
    medianPerMove[3] = medianPerMove[3].toFixed(2);

    return medianPerMove;
  },

  /* Returns players stats for single game */
  findGameStats: function (game) {

    var gameStats = {
      position: [],
      score: [],
      topSingleMove: [],
      worstSingleMove: [],
      medianPerMove: []
    }

    /* Find Score for each player */
    gameStats.score = this.findScoresSingleGame(game);

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

    game.players.forEach(player => {
      if (player.name != null) {
        var tempScore = [];
        /* First values are the same */
        tempScore.push(player.scores[0]);
        for (var i = 1; i < player.scores.length; i++) {
          /* Sum rest of the values */
          var tempValue = tempScore[i - 1] + player.scores[i];
          tempScore.push(tempValue);
        }
        sumScores.push(tempScore);
      }

    });

    return sumScores;
  }

  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/
  /*----- specific game from database ------*/
  /*-------------------------------------------------------*/
  /*-------------------------------------------------------*/

}