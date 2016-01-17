"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var _ = require("underscore");

var ActionTypes = CKPTConstants.ActionTypes;
var CHANGE_EVENT = "change";

var _players = [];
var _errors = [];
var _player = { uuid: "", name: "", nick: "", user: { username: "" }, loggedIn: false };
var _quotes = null;
var _invalidated = {players: false, quotes: false};

var PlayerStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getPlayers: function() {
    return _players;
  },

  getFromUser: function(username) {
    for (var i = 0; i < _players.length; i++) {
      if (_players[i].user && _players[i].user.username === username) {
        return _players[i];
      }
    }
    return null;
  },

  getFromUUID: function(uuid) {
    return _.findWhere(_players, {uuid: uuid});
  },

  getPlayer: function() {
    return _player;
  },

  getQuotes: function() {
    var retquotes = [];
    _players.forEach(function (p) {
      if (_.has(_quotes, p.uuid)) {
        _quotes[p.uuid].forEach(function (q) {
          retquotes.push({uuid: p.uuid, nick: p.nick, quote: q});
        });
      }
    });

    if (retquotes.length) {
      return retquotes;
    }
    return [{uuid: null, quote: null, nick: null}];
  },

  getCreditsByUUID: function(uuid) {
    var credits = [];
    for (var i=0; i < _players.length; i++) {
      if (uuid === _players[i].uuid) {
        continue;
      }
      for (var j=0; j < _players[i].debts.length; j++) {
        if (_players[i].debts[j].creditor === uuid) {
          credits.push(_players[i].debts[j]);
        }
      }
    }

    return credits;
  },

  getVotes: function() {
    var votes = _.pluck(_players, "votes");
    var winnerVotes = _.reject(_.pluck(votes, "winner"), function(num) {
      return num == "00000000-0000-0000-0000-000000000000";
    });
    var loserVotes = _._.reject(_.pluck(votes, "loser"), function(num) {
      return num == "00000000-0000-0000-0000-000000000000";
    });

    winnerVotes = _.countBy(winnerVotes, function(num) {return num; });
    loserVotes = _.countBy(loserVotes, function(num) {return num; });

    var winner = _.invert(winnerVotes)[_.max(winnerVotes)];
    var loser = _.invert(loserVotes)[_.max(loserVotes)];
    return {winner: winner, loser: loser};

  },

  getGossip: function() {
    var self = this;
    var gossip = [];
    _.each(_players, function(p, i) {
      _.each(p.gossip, function(g, gk) {
        if (g != "") {
          var targetPlayer = self.getFromUUID(gk) || {nick: ""};
          var byline = p.nick + " om " + targetPlayer.nick;
          gossip.push({quote: g, nick: byline});
        }
      });
    });
    return gossip;
  },

  getErrors: function() {
    return _errors;
  },

  isValid: function(key) {
    return !_invalidated[key];
  },

});

PlayerStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECIEVE_PLAYERS:
      if (action.errors) {
        _errors = action.errors;
      }
      else if (action.json) {
        var recievedPlayers = JSON.parse(action.json);
        _players = recievedPlayers;
        _errors = [];
        _invalidated.players = false;
      }
      PlayerStore.emitChange();
      break;

    case ActionTypes.SAVE_PLAYER_PROFILE:
      break;

    case ActionTypes.ADD_PLAYER_DEBT:
      break;

    case ActionTypes.ADD_PLAYER_DEBT_COMPLETE:
      if (action.errors) {
        _errors = action.errors;
      }
      else if (action.debt) {
        _invalidated.players = true;
        _errors = [];
      }
      PlayerStore.emitChange();
      break;

    case ActionTypes.SETTLE_PLAYER_DEBT:
      break;

    case ActionTypes.SETTLE_PLAYER_DEBT_COMPLETE:
      if (action.errors) {
        _errors = action.errors;
      }
      else {
        _invalidated.players = true;
        _errors = [];
      }
      PlayerStore.emitChange();
      break;

    case ActionTypes.SET_PLAYER_VOTES:
      break;

    case ActionTypes.SET_PLAYER_VOTES_COMPLETE:
      if (action.errors) {
        _errors = action.errors;
      }
      else if (action.votes) {
        _invalidated.players = true;
        _errors = [];
      }
      PlayerStore.emitChange();
      break;

    case ActionTypes.SET_PLAYER_GOSSIP:
      break;

    case ActionTypes.SET_PLAYER_GOSSIP_COMPLETE:
      if (action.errors) {
        _errors = action.errors;
      }
      else if (action.gossip) {
        _invalidated.players = true;
        _errors = [];
      }
      PlayerStore.emitChange();
      break;

    case ActionTypes.RECIEVE_QUOTES:
      if (action.json) {
        var recievedQuotes = JSON.parse(action.json);
        _quotes = recievedQuotes;
        _errors = [];
        _invalidated.quotes = false;
      }
      if (action.errors) {
        _errors = action.errors;
      }
      PlayerStore.emitChange();
      break;

  }

  return true;
});

module.exports = PlayerStore;
