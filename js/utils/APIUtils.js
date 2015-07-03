"use strict";

var ServerActionCreators = require("../actions/ServerActionCreators.react.js");
var request = require("superagent");

var endpoints = {
  players: "http://localhost:8000/players"
};

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

var _dummystandings = {
  byWinnings: [
    { uuid: "39572f8d-eb2d-4e9c-9384-0c42c40f5eb0",
      played: 6,
      playedEnough: false,
      winnings: 1200,
      wins: 2
    },
    { uuid: "11c79fab-bb3f-4d5a-8f33-4f5bd9f0419e",
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

    request.get(endpoints.players)
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify(res.body);
        ServerActionCreators.receivePlayers(json, null);
      });

    request.get(endpoints.players + "/quotes")
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify(res.body);
        ServerActionCreators.receiveQuotes(json, null);
      });
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
