"use strict";

var ServerActionCreators = require("../actions/ServerActionCreators.react.js");
//var request = require("superagent");

var _dummytasks = ["foo"];
var _dummyuser = {
  username: "mortenk",
  admin: false,
  locked: false,
  apitoken: "8a3452fd412ee483cd449",
  settings: {
    optionA: true,
    optionB: false
  }
};
var _dummyplayers = [
  {
    uuid: "312312-44123-31213-3213",
    profile: {
      name: "Morten Knutsen",
      picture: null,
      birthday: null,
      email: "knumor@gmail.com",
      description: "Dummy user"
    },
    active: true,
    quotes: ["Blinde høns kan også finne korn!"],
    gossip: {},
    complaints: [],
    nick: "Panzer",
    user: {
      username: "mortenk"
    }
  },
  {
    uuid: "1111",
    nick: "Lars Vegas",
    user: {
      username: "lars"
    }

  },
  {
    uuid: "2222",
    nick: "Syntax Error",
    quotes: ["Nå skal det spilles tight!"],
    user: {
      username: "frodein"
    }

  },
  {
    uuid: "3333",
    nick: "Pæra",
    user: {
      username: "frodes"
    }

  }
];

var _dummystandings = {
  byWinnings: [
    { uuid: "1111",
      played: 6,
      playedEnough: false,
      winnings: 1200,
      wins: 2
    },
    { uuid: "2222",
      played: 8,
      playedEnough: true,
      winnings: 800,
      wins: 2
    },
    { uuid: "3333",
      played: 8,
      playedEnough: true,
      winnings: 800,
      wins: 2
    },
    { uuid: "312312-44123-31213-3213",
      played: 8,
      playedEnough: true,
      winnings: -400,
      wins: 0
    }
  ],
  byAvgRank: [],
  byPoints: [],
  byHeadsUp: []
};
var _dummyseason = 2015;

module.exports = {

  loadTasks: function() {
    // var uuid = sessionStorage.getItem("uuid");
    var json = JSON.stringify(_dummytasks);
    ServerActionCreators.receiveTasks(json, null);
  },

  loadPlayers: function() {
    var json = JSON.stringify(_dummyplayers);
    ServerActionCreators.receivePlayers(json, null);
  },

  loadSeason: function(season) {
    if (season) {
      _dummyseason = season;
    }
    var json = JSON.stringify({
      standings: _dummystandings,
      season: _dummyseason
    });
    ServerActionCreators.receiveStandings(json, null);
  },

  login: function(username, password) {
    if (username === "mortenk" && password === "testing123") {
      ServerActionCreators.receiveLogin(JSON.stringify(_dummyuser), null);
    } else {
      ServerActionCreators.receiveLogin(null, ["Invalid username and/or password"]);
    }
    // request.post("http://localhost:3002/v1/login")
    //   .send({ username: email, password: password, grantType: "password" })
    //   .set("Accept", "application/json")
    //   .end(function(error, res){
    //     if (res) {
    //       if (res.error) {
    //         return;
    //         //var errorMsgs = _getErrors(res);
    //         //ServerActionCreators.receiveLogin(null, errorMsgs);
    //       } else {
    //         var json = JSON.parse(res.text);
    //         ServerActionCreators.receiveLogin(json, null);
    //       }
    //     }
    //   });
  }
};
