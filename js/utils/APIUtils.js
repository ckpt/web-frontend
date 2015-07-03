"use strict";

var ServerActionCreators = require("../actions/ServerActionCreators.react.js");
var request = require("superagent");

var _endpoints = {
  players: "http://localhost:8000/players",
  login: "http://localhost:8000/login"
};

var _dummytasks = ["foo"];
var _dummystandings = {
  byWinnings: [
    { uuid: "27b5c391-8126-418e-b50e-73e6636e5493",
      played: 6,
      playedEnough: false,
      winnings: 1200,
      wins: 2
    },
    { uuid: "e5f0fa05-6c81-46bf-833b-b2511b315b63",
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

    request.get(_endpoints.players)
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify(res.body);
        ServerActionCreators.receivePlayers(json, null);
      });

    request.get(_endpoints.players + "/quotes")
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
    request.post(_endpoints.login)
      .accept("json")
      .send({username: username, password: password})
      .end(function(err, res) {
        if (res.ok) {
          var json = JSON.stringify(res.body);
          ServerActionCreators.receiveLogin(json, null);
        } else {
          if (res.forbidden) {
            ServerActionCreators.receiveLogin(null, ["Forbidden"]);
          } else if (err) {
            ServerActionCreators.receiveLogin(null, [err.status + " - Unknown error"]);
          }
        }
      });
  }
};
