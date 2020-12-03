const e = require("express");

module.exports = {

  find2PlayersNames: function (gameTable) {
    return [gameTable[0].player1.name, gameTable[0].player2.name];
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

    var p1Top = this.findTop5SingleGame(game.player1);
    var p2Top = this.findTop5SingleGame(game.player2);

    if (p1Top[0] > p2Top[0]) {
      topScorer = {
        name: game.player1.name,
        topScore: p1Top[0]
      };
    } else if (p2Top[0] > p1Top[0]) {
      topScorer = {
        name: game.player2.name,
        topScore: p2Top[0]
      };
    } else {
      if (p1Top[1] > p2Top[1]) {
        topScorer = {
          name: game.player1.name,
          topScore: p1Top[1]
        };
      } else if (p2Top[1] > p1Top[1]) {
        topScorer = {
          name: game.player2.name,
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
    const score1 = game.player1.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
    const score2 = game.player2.scores.reduce(this.findTotalScoreSingleGameEachPlayer);

    if (score1 > score2) {
      return game.player1.name;
    } else if (score2 > score1) {
      return game.player2.name;
    } else
      return "It's a tie!";
  },

  findLoser: function (game) {
    const score1 = game.player1.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
    const score2 = game.player2.scores.reduce(this.findTotalScoreSingleGameEachPlayer);

    if (score1 > score2) {
      return game.player2.name;
    } else if (score2 > score1) {
      return game.player1.name;
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
      if (this.findWinner(element) === element.player1.name) {
        resultArray[0]++;
      } else if (this.findWinner(element) === element.player2.name) {
        resultArray[1]++;
      } else {}
    });
    return resultArray;
  },

  countMaximumGameScoreForEachPlayer: function (gameTable) {
    var resultArray = [-1, -1];
    gameTable.forEach(element => {
      const scoreOfPlayer1CurrentGame = element.player1.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      const scoreOfPlayer2CurrentGame = element.player2.scores.reduce(this.findTotalScoreSingleGameEachPlayer);

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
      var score1 = element.player1.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      var score2 = element.player2.scores.reduce(this.findTotalScoreSingleGameEachPlayer);

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
      var score1 = element.player1.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      var score2 = element.player2.scores.reduce(this.findTotalScoreSingleGameEachPlayer);

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
      const score1 = element.player1.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      const score2 = element.player2.scores.reduce(this.findTotalScoreSingleGameEachPlayer);
      differenceArray.push(Math.abs(score1 - score2));
    });
    return differenceArray;
  },

  findTopMovePerPlayer: function (gameTable) {
    var resultArray = [-1, -1];

    gameTable.forEach(element => {
      element.player1.scores.forEach(el => {
        if (resultArray[0] < el) {
          resultArray[0] = el;
        }
      });
      element.player2.scores.forEach(el => {
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
      temp1 += element.player1.scores.reduce(this.findTotalScoreSingleGameEachPlayer) / gameTable.length;
      temp2 += element.player2.scores.reduce(this.findTotalScoreSingleGameEachPlayer) / gameTable.length;
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
      element.player1.scores.forEach((el, index) => {
          temp1 += (el / (element.player1.scores.length * gameTable.length));
          temp2 += (element.player2.scores[index] / (element.player1.scores.length * gameTable.length));
      });
    });
    
    resultArray[0] = temp1.toFixed(2);
    resultArray[1] = temp2.toFixed(2);
    return resultArray;
  },

  findSpecificStats: function (gameTable, index) {
    var resultArray = [ , ];
    resultArray[0] = gameTable[index].player1;
    resultArray[1] = gameTable[index].player2;
    return resultArray;
  },


  // findDiscrepancies: function (gameTable){
  //   gameTable.forEach(element => {
  //     if(element.player1.scores.length !=  element.player2.scores.length){
  //       console.log("-----");
  //       console.log(element.player1.scores[0] + ":" + element.player1.scores.length); 
  //       console.log(element.player2.scores[0] + ":" + element.player2.scores.length);
  //     }
  //   });
  //}

}