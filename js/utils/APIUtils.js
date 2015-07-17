"use strict";

var ServerActionCreators = require("../actions/ServerActionCreators.react.js");
var request = require("superagent");

var _endpoints = {
  players: "http://localhost:8000/players",
  login: "http://localhost:8000/login",
  locations: "http://localhost:8000/locations",
  tournaments: "http://localhost:8000/tournaments",
  seasons: "http://localhost:8000/seasons"
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
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify(res.body);
        ServerActionCreators.receivePlayers(json, null);
      });

    request.get(_endpoints.players + "/quotes")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify(res.body);
        ServerActionCreators.receiveQuotes(json, null);
      });
  },

  savePlayerProfile: function(uuid, profile) {

    request.put(_endpoints.players + "/" + uuid + "/profile")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send(profile)
      .end(function(err, res) {
        if (err) { throw err; }
        // TODO: Propagate error action? This should probably result in another action fetching all players again, if the store cannot rollback on its own. Also, spawn a notification via some generic error propagation in the UI.
      });
  },

  saveUserSettings: function(uuid, settings, password) {

    if (password) {
      request.put(_endpoints.players + "/" + uuid + "/user/password")
        .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
        .accept("json")
        .send({"password": password})
        .end(function(err, res) {
          if (err) { throw err; }
          // TODO: Propagate error action? This should probably result in another action fetching all players again, if the store cannot rollback on its own. Also, spawn a notification via some generic error propagation in the UI.
          // TODO: Propagate action USER_SETTINGS_SAVED on success, which can be used by notification store.
      });
    }

  },


  loadLocations: function() {

    request.get(_endpoints.locations)
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify(res.body);
        ServerActionCreators.receiveLocations(json, null);
      });
  },

  loadTournaments: function() {

    request.get(_endpoints.tournaments)
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify(res.body);
        ServerActionCreators.receiveTournaments(json, null);
      });
  },

  loadSeason: function(season) {

    request.get(_endpoints.seasons + "/" + season + "/standings")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify({
          standings: res.body,
          season: season
        });
        ServerActionCreators.receiveStandings(json, null);
      });
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
