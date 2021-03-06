"use strict";

var ServerActionCreators = require("../actions/ServerActionCreators.react.js");
var request = require("superagent");
var APIRoot = require("../constants/CKPTConstants").API_ROOT;

var _endpoints = {
  players: APIRoot + "/players",
  login: APIRoot + "/login",
  locations: APIRoot + "/locations",
  news: APIRoot + "/news",
  tournaments: APIRoot + "/tournaments",
  seasons: APIRoot + "/seasons"
};

var _dummytasks = ["foo"];

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
        ServerActionCreators.savePlayerProfile(profile, err);
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

  addDebt: function(creditor, debitor, amount, reason) {
    var debt = {creditor: creditor, amount: amount, description: reason};
    request.post(_endpoints.players + "/" + debitor + "/debts")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send(debt)
      .end(function(err, res) {
        ServerActionCreators.addDebt(debt, err);
      });
  },

  settleDebt: function(uuid, debitor) {

    request.del(_endpoints.players + "/" + debitor + "/debts/" + uuid)
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        ServerActionCreators.settleDebt(err);
    });
  },

  setVotes: function(uuid, votes) {
    request.put(_endpoints.players + "/" + uuid + "/votes")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send(votes)
      .end(function(err, res) {
        ServerActionCreators.setVotes(votes, err);
      });
  },

  setGossip: function(uuid, gossip) {
    request.put(_endpoints.players + "/" + uuid + "/gossip")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send(gossip)
      .end(function(err, res) {
        ServerActionCreators.setGossip(gossip, err);
      });
  },

  saveTournamentResults: function(uuid, results, bountyhunters) {

    request.put(_endpoints.tournaments + "/" + uuid + "/bountyhunters")
    .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
    .accept("json")
    .send(bountyhunters)
    .end(function(err, res) {
      ServerActionCreators.saveTournamentResults(uuid, null, err)
    });

    request.put(_endpoints.tournaments + "/" + uuid + "/result")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send({result: results})
      .end(function(err, res) {
        ServerActionCreators.saveTournamentResults(uuid, results, err)
      });
  },

   setTournamentHost: function(uuid, location) {

    request.patch(_endpoints.tournaments + "/" + uuid)
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send({location: location})
      .end(function(err, res) {
        if (err) { throw err; }
        // TODO: Propagate error action? This should probably result in another action fetching all players again, if the store cannot rollback on its own. Also, spawn a notification via some generic error propagation in the UI.
        // TODO: Propagate HOST_SAVED on success, which can be used by some store.
      });
  },

   addTournamentNoShow: function(uuid, player, reason) {

    var noshow = {player: player, reason: reason};

    request.post(_endpoints.tournaments + "/" + uuid + "/noshows")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send(noshow)
      .end(function(err, res) {
        ServerActionCreators.addNoShow(noshow, err);
      });
  },

  removeTournamentNoShow: function(uuid, player) {

    request.del(_endpoints.tournaments + "/" + uuid + "/noshows/" + player)
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        ServerActionCreators.removeNoShow(err);
      });
  },

  createNewsItem: function(itemData) {

    request.post(_endpoints.news)
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send(itemData)
      .end(function(err, res) {
        ServerActionCreators.saveNewsItem(itemData, err);
      });
  },

  updateNewsItem: function(uuid, itemData) {

    request.patch(_endpoints.news + "/" + uuid)
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send(itemData)
      .end(function(err, res) {
        ServerActionCreators.saveNewsItem(itemData, err);
      });
  },

  addNewsComment: function(uuid, commentData) {

    request.post(_endpoints.news + "/" + uuid + "/comments")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .send(commentData)
      .end(function(err, res) {
        ServerActionCreators.addNewsComment(commentData, err);
      });
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

  loadNewsItems: function() {

    request.get(_endpoints.news)
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify(res.body);
        ServerActionCreators.receiveNewsItems(json, null);
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

    var path = "";
    if (season != "all") {
      path = "/" + season;
    }

    request.get(_endpoints.seasons + path + "/standings")
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

  loadStats: function(season) {

    var path = "";
    if (season != "all") {
      path = "/" + season;
    }

    request.get(_endpoints.seasons + path + "/stats")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify({
          stats: res.body,
          season: season
        });
        ServerActionCreators.receiveStats(json, null);
      });

    request.get(_endpoints.seasons + path + "/titles")
      .set("Authorization", "CKPT " + sessionStorage.getItem("accessToken"))
      .accept("json")
      .end(function(err, res) {
        if (err) { throw err; }
        var json = JSON.stringify({
          titles: res.body,
          season: season
        });
        ServerActionCreators.receiveTitles(json, null);
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
