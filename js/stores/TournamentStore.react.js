"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var _ = require("underscore");
var moment = require("moment");
//var momentLocale = require("moment/locale/nb.js");
//moment.locale("nb", momentLocale);

var ActionTypes = CKPTConstants.ActionTypes;
var CHANGE_EVENT = "change";

var _tournaments = [];
var _errors = [];

var TournamentStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getTournaments: function() {
    return _tournaments;
  },

  getNext: function() {
    var candidates = _.reject(_tournaments, function(t) {
      return moment().isAfter(t.info.scheduled);
    });
    if (!candidates.length) {
      return null;
    }
    return _.sortBy(candidates, function(c) {
      return c.info.scheduled;
    })[0];
  },

  getAllSeasons: function() {
    var seasons = _.countBy(_tournaments, function(t) { return t.info.season; });
    return _.keys(seasons);
  },

  getPlayedTournamentsBySeason: function(season) {
    var candidates = _.reject(_tournaments, function(t) {
      return t.info.season !== season || !t.played;
    });
    if (!candidates.length) {
      return null;
    }
    return _.sortBy(candidates, function(c) {
      return c.info.scheduled;
    });
  },

  getUnplayedTournamentsBySeason: function(season) {
    var candidates = _.reject(_tournaments, function(t) {
      return t.info.season !== season || t.played;
    });
    if (!candidates.length) {
      return null;
    }
    return _.sortBy(candidates, function(c) {
      return c.info.scheduled;
    });
  },

  getFromUUID: function(uuid) {
    return _.findWhere(_tournaments, {uuid: uuid});
  },

  getFromLocation: function(uuid) {
    return _.filter(_tournaments, function (t) { return t.info.location === uuid; });
  },

  getErrors: function() {
    return _errors;
  }

});

TournamentStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECIEVE_TOURNAMENTS:
      if (action.json) {
        var recievedTournaments = JSON.parse(action.json);
        _tournaments = recievedTournaments;
        _errors = [];
      }
      if (action.errors) {
        _errors = action.errors;
      }
      TournamentStore.emitChange();
      break;
  }

  return true;
});

module.exports = TournamentStore;
