"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var _ = require("underscore");

var ActionTypes = CKPTConstants.ActionTypes;
var CHANGE_EVENT = "change";

var _newsitems = [];
var _errors = [];

var NewsStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getNewsItems: function() {
    return _newsitems;
  },

  getByUUID: function(uuid) {
    return _.findWhere(_newsitems, {uuid: uuid});
  },
  
  getByTag: function(tag) {
    return _.where(_newsitems, {tag: tag});
  },

  getErrors: function() {
    return _errors;
  }

});

NewsStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECIEVE_NEWS_ITEMS:
      if (action.json) {
        var recievedNewsItems = JSON.parse(action.json);
        _newsitems = recievedNewsItems;
        _errors = [];
      }
      if (action.errors) {
        _errors = action.errors;
      }
      NewsStore.emitChange();
      break;
  }

  return true;
});

module.exports = NewsStore;
