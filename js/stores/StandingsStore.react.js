"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var _ = require("underscore");
var ActionTypes = CKPTConstants.ActionTypes;
var CHANGE_EVENT = "change";

var _season = null;
var _standings = {
  byWinnings: [],
  byAvgPlace: [],
  byPoints: [],
  byHeadsUp: [],
  byWinRatio: [],
  byWinRatioTotal: [],
  byNumPlayed: []
};

var _errors = [];

//var _details = { 
//  uuid_1: {
//    played: 0,
//    winnings: null,
//    avgRank: null,
//    points: null,
//    headsUpCount: null,
//    wins: null
//  }
//};

var StandingsStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getStandings: function(all) {
    if (all) {
      return _standings;
    } else {
      return _standings.byWinnings;
    }
  },

  getForPlayer: function(uuid, all) {
    var _ret = {
      byWinnings: null,
      byAvgPlace: null,
      byPoints: null,
      byHeadsUp: null
    };

    Object.keys(_standings).forEach(function (k) {
      if (!_standings[k]) {
        _ret[k] = null;
      } else {
        _ret[k] = _standings[k].filter(function(item) {
          return item.uuid === uuid;
        }).pop() || null;
      }
    });

    if (all) {
      return _ret;
    } else {
      return _ret.byWinnings || null;
    }
  },

  getSeason: function() {
    return _season;
  },

  getLeader: function() {
    return _standings.byWinnings ? _standings.byWinnings[0] : null;
  },

  getCurrentForm: function() {
    var playerForm = [];
    var s = _standings.byWinnings;
    _.each(s, function(entry) {
      var sortedResults = _.sortBy(entry.results, function(r) { return r.when; });
      playerForm.push({uuid: entry.uuid, form: _.last(sortedResults, 4).reverse()});
    });
    return _.sortBy(playerForm, function(pf) {
      return pf.form.reduce(function(a, b){ return {place: a.place + b.place}; }).place / pf.form.length;
    });
  },

  getLastHeadsUp: function() {
    var playerLastHeadsUp = [];
    var s = _standings.byWinnings;
    _.each(s, function(entry) {
      var sortedResults = _.sortBy(entry.results, function(r) { return r.when; }).reverse();
      var last = _.find(sortedResults, function(r) { return r.place === 1 || r.place === 2; });
      if (last) {
        playerLastHeadsUp.push({uuid: entry.uuid, last: last.when});
      }
    });
    return _.sortBy(playerLastHeadsUp, function (phu) { return phu.last; }).reverse();
  },

  getErrors: function() {
    return _errors;
  }

});

StandingsStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECIEVE_STANDINGS:
      if (action.json) {
        var recievedStandings = JSON.parse(action.json);
        _standings = recievedStandings.standings;
        _season = recievedStandings.season;
      }
      if (action.errors) {
        _errors = action.errors;
      }
      StandingsStore.emitChange();
      break;
  }

  return true;
});

module.exports = StandingsStore;
