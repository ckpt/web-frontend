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

  getErrors: function() {
    return _errors;
  }

});

PlayerStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECIEVE_PLAYERS:
      if (action.json) {
        var recievedPlayers = JSON.parse(action.json);
        _players = recievedPlayers;
        _errors = [];
      }
      if (action.errors) {
        _errors = action.errors;
      }
      PlayerStore.emitChange();
      break;

    case ActionTypes.SAVE_PLAYER_PROFILE:
      var updated = false;
      if (action.uuid) {
        for (var i = 0; i < _players.length; i++) {
          if (_players[i].uuid === action.uuid) {
            _players[i].profile = action.profile;
          }
        }
      }
      if (!updated) {
        break;
      }
      PlayerStore.emitChange();
      break;

    case ActionTypes.RECIEVE_QUOTES:
      if (action.json) {
        var recievedQuotes = JSON.parse(action.json);
        _quotes = recievedQuotes;
        _errors = [];
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
