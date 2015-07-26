"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var _ = require("underscore");


var ActionTypes = CKPTConstants.ActionTypes;
var CHANGE_EVENT = "change";

var _season = null;
var _stats = {
  yellowPeriods: [],
  monthStats: []
};

var _titles = {};

var _errors = [];

var StatsStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getStats: function() {
      return _stats;
  },

  getTitles: function() {
    return _titles;
  },

  getSeason: function() {
    return _season;
  },

  getNumBestMonths: function() {
    var bestByPlayer = _.pairs(_.countBy(_stats.monthStats, function(month) {
      return month.best;
    }));
    var sorted = _.sortBy(bestByPlayer, function(p) {
      return -p[1];
    });
    return sorted;
  },

  getNumWorstMonths: function() {
    var bestByPlayer = _.pairs(_.countBy(_stats.monthStats, function(month) {
      return month.worst;
    }));
    var sorted = _.sortBy(bestByPlayer, function(p) {
      return p[1];
    });
    return sorted;
  },

  getLongestYellowPeriods: function() {
    return _.sortBy(_stats.yellowPeriods, function(p) {
      return -moment(p.to).diff(moment(p.from));
    });
  },

  getErrors: function() {
    return _errors;
  }
});

StatsStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECIEVE_STATS:
      if (action.json) {
        var recievedStats = JSON.parse(action.json);
        _stats = recievedStats.stats;
        _season = recievedStats.season;
      }
      if (action.errors) {
        _errors = action.errors;
      }
      StatsStore.emitChange();
      break;

    case ActionTypes.RECIEVE_TITLES:
      if (action.json) {
        var recievedTitles = JSON.parse(action.json);
        _titles = recievedTitles.titles;
        _season = recievedTitles.season;
      }
      if (action.errors) {
        _errors = action.errors;
      }
      StatsStore.emitChange();
      break;
  }

  return true;
});

module.exports = StatsStore;
