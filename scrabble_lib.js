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

  findTotalScoreSingleGameEachPlayer: function (total, num) {
    return total + num;
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

  findSpecificStats: function (gameTable, index) {
    var resultArray = [, ];
    resultArray[0] = gameTable[index].players[0];
    resultArray[1] = gameTable[index].players[1];
    return resultArray;
  },


  // findDiscrepancies: function (gameTable){
  //   gameTable.forEach(element => {
  //     if(element.players[0].scores.length !=  element.players[1].scores.length){
  //       console.log("-----");
  //       console.log(element.players[0].scores[0] + ":" + element.players[0].scores.length); 
  //       console.log(element.players[1].scores[0] + ":" + element.players[1].scores.length);
  //     }
  //   });
  //}

  /* Profile functions */
  /*findPlayersNames2: function(gameTable, users, gameID) {
    var resultArray = [ , ];
    var player1ID = 0;
    var player2ID = 0;

    gameTable.forEach(element => {  //TODO better with if in order to use break
      if(element._id === gameID){
        player1ID = element.players[0]._id;
        player2ID = element.players[1]._id;
      }
    });

    users.forEach(user => {
      if(player1ID === user._id){
        resultArray[0] = user.name;
      }
      else if(player2ID === user._id){
        resultArray[1] = user.name;
      }
    });
    return resultArray;
  }, */

  findPlayersNameFromID: function (users, userID) {

    for (var i = 0; i < users.length; i++) {
      if (users[i]._id === userID) {
        return users[i].name;
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

  findScoresForSpecificGame: function (game) {

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

  calculateStatsVsOpponent: function (result, opponents, firstOppID, secondOppID, thirdOppID) {

    switch (result) {
      case "1st":
        opponents.forEach(opponent => {
          //Second player definitely exists 
          if(opponent._id === firstOppID){
            opponent.victories++;
          }
          //Check if third player exists 
          if(secondOppID != null && opponent._id === secondOppID){
            opponent.victories++;
          }
          //Check if fourth player exists 
          if(thirdOppID != null && opponent._id === thirdOppID){
            opponent.victories++;
          }
        });
        break;
      case "2nd":
        opponents.forEach(opponent => {
          //Second player definitely exists 
          if(opponent._id === firstOppID){
            opponent.losses++;
          }
          //Check if third player exists
          if(secondOppID != null && opponent._id === secondOppID){
            opponent.victories++;
          }
          //Check if fourth player exists 
          if(thirdOppID != null && opponent._id === thirdOppID){
            opponent.victories++;
          }
        });
        break;
      case "3rd":
        opponents.forEach(opponent => {
          //Second player definitely exists
          if(opponent._id === firstOppID){
            opponent.losses++;
          }
          //Third player definitely exists
          if(secondOppID != null && opponent._id === secondOppID){
            opponent.losses++;
          }
          //Check if fourth player exists 
          if(thirdOppID != null && opponent._id === thirdOppID){
            opponent.victories++;
          }
        });
        break;
      case "4th":
        opponents.forEach(opponent => {
          //Second player definitely exists 
          if(opponent._id === firstOppID){
            opponent.losses++;
          }
          //Third player definitely exists
          if(opponent._id === secondOppID){
            opponent.losses++;
          }
          //Fourth player definitely exists
          if(opponent._id === thirdOppID){
            opponent.losses++;
          }
        });
        break;
      default:
        break;
    }
  },

  findPlayersGameStats: function (gameTable, userID) {

    //Returned Struct
    var player = {
      //numOfGames: 0,
      games: [],
      positionStats: {
        pos1num: 0,
        pos1stats: {
          games: [],
          diff: []
        },
        pos2num: 0,
        pos2stats: {
          games: [],
          diff: []
        },
        pos3num: 0,
        pos3stats: {
          games: [],
          diff: []
        },
        pos4num: 0,
        pos4stats: {
          games: [],
          diff: [],
        }
      },
      opponents: []
    }

    //Games in which player participated
    // var games = [];

    //Find in how many games participated and which 
    gameTable.forEach(element => {
      if (element.players[0]._id === userID || element.players[1]._id === userID || element.players[2]._id === userID || element.players[3]._id === userID) {
        player.games.push(element);
      }
    });

    //Store numOfGames
    //numOfGames = player.games.length;

    //Find all different opponents   
    player.games.forEach(element => {
      element.players.forEach(el => {
        /* Check if opponent is not current player & if he exists */
        if (el._id != null && el._id != userID) {
          /* An opponent found. 
          Check if new opponent */
          if (this.IsNewOpponent(player.opponents, el._id)) {
            /* A new opponent found */
            var newOpponent = {
              _id: el._id,
              name: el.name,
              victories: 0,
              losses: 0,
              ties: 0,
            }
            player.opponents.push(newOpponent);
          }
        }
      })
    });

    //Find in which games won & lost and the difference in each occasion 
    player.games.forEach(element => {
      var scoreboard = this.findScoresForSpecificGame(element);
      if (userID === scoreboard[0]._id) {
        /* First Positions  */
        player.positionStats.pos1num++;
        /* Save relative games */
        player.positionStats.pos1stats.games.push(element);
        /* Calculate differences */
        player.positionStats.pos1stats.diff.push(this.calculateDiffs(0, scoreboard));
        /* Add victory to opponent table */
        this.calculateStatsVsOpponent("1st", player.opponents, scoreboard[1]._id, scoreboard[2]._id, scoreboard[3]._id);

      } else if (userID === scoreboard[1]._id) {
        //Second Positions
        player.positionStats.pos2num++;
        player.positionStats.pos2stats.games.push(element);
        player.positionStats.pos2stats.diff.push(this.calculateDiffs(1, scoreboard));
        /* Add loss to opponent table */
        this.calculateStatsVsOpponent("2nd", player.opponents, scoreboard[0]._id, scoreboard[2]._id, scoreboard[3]._id);

      } else if (userID === scoreboard[2]._id) {
        //Third Positions
        player.positionStats.pos3num++;
        player.positionStats.pos3stats.games.push(element);
        player.positionStats.pos3stats.diff.push(this.calculateDiffs(2, scoreboard));
        /* Add loss to opponent table */
        this.calculateStatsVsOpponent("3rd", player.opponents, scoreboard[0]._id, scoreboard[1]._id, scoreboard[3]._id);

      } else {
        //Fourth Positions
        player.positionStats.pos4num++;
        player.positionStats.pos4stats.games.push(element);
        player.positionStats.pos4stats.diff.push(this.calculateDiffs(3, scoreboard));
        /* Add loss to opponent table */
        this.calculateStatsVsOpponent("4th", player.opponents, scoreboard[0]._id, scoreboard[1]._id, scoreboard[2]._id);

      }
    });

    //Find top 5 games 


    //Find least 5 games
    return player;
  }

}