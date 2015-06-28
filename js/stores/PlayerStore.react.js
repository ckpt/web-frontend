"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

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

  getLoggedIn: function() {
    return _players.filter(function(item) {
      return item.loggedIn;
    });
  },

  getPlayer: function() {
    return _player;
  },

  getErrors: function() {
    return _errors;
  }

});

PlayerStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_PLAYER:
      if (action.json) {
        _player = action.json.player;
      }
      if (action.errors) {
        _errors = action.errors;
      }
      PlayerStore.emitChange();
      break;

    case ActionTypes.RECEIVE_PLAYERS:
      if (action.json) {
        _players = action.json.players;
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
