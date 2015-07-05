"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var _ = require("underscore");

var ActionTypes = CKPTConstants.ActionTypes;
var CHANGE_EVENT = "change";

var _locations = [];
var _errors = [];

var LocationStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getLocations: function() {
    return _locations;
  },

  getFromUUID: function(uuid) {
    return _.findWhere(_locations, {uuid: uuid});
  },

  getErrors: function() {
    return _errors;
  }

});

LocationStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECIEVE_LOCATIONS:
      if (action.json) {
        var recievedLocations = JSON.parse(action.json);
        _locations = recievedLocations;
        _errors = [];
      }
      if (action.errors) {
        _errors = action.errors;
      }
      LocationStore.emitChange();
      break;
  }

  return true;
});

module.exports = LocationStore;
