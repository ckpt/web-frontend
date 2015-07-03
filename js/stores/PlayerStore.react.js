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
    return _players.filter(function(item) {
      return item.user.username === username;
    }).pop() || null;
  },

  getFromUUID: function(uuid) {
    return _.findWhere(_players, {uuid: uuid});
  },

  getPlayer: function() {
    return _player;
  },

  getQuotes: function() {
    var withQuotes = _.filter(_players, function(p) {
      return p.quotes && p.quotes.length;
    });
    var quotes = _.flatten(_.map(withQuotes, function(p) {
      return _.map(p.quotes, function(q) {
        var quoteObj = _.pick(p, "uuid", "nick");
        quoteObj.quote = q;
        return quoteObj;
      });
    }));
    if (quotes.length) {
      return quotes;
    }
    return [{uuid: null, quote: null, nick: null}];
  },

  getErrors: function() {
    return _errors;
  }

});

PlayerStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECIEVE_PLAYER:
      if (action.json) {
        _player = action.json.player;
      }
      if (action.errors) {
        _errors = action.errors;
      }
      PlayerStore.emitChange();
      break;

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
  }

  return true;
});

module.exports = PlayerStore;
