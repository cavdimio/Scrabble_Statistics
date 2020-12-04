const e = require("express");

module.exports = {

  findPlayersNames: function (gameTable, index) {
    var resultArray = [ , ];
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
    var resultArray = [ , ];
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

  findPlayersNameFromID: function(users, userID){

    for(var i=0; i< users.length; i++){
      if(users[i]._id === userID){
        return users[i].name;
      }
    }
    return null;
  },

  findPlayersGameStats: function(gameTable, userID){

    var player = {
      numOfGames : 0 
    }

    //Find in how many games participated 
    
    //Find in which games won and by how much 

    //Find in which games lost and by how much 

    //Find top 5 games 

    //Find least 5 games

    //Find how much times won or lose against an opponent 
  }

}