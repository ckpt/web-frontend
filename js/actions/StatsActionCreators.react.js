"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var APIUtils = require("../utils/APIUtils.js");

var ActionTypes = CKPTConstants.ActionTypes;

module.exports = {

  loadSeason: function(season) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOAD_SEASON_STATS,
      season: season
    });
    APIUtils.loadStats(season);
  },

  loadAll: function() {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOAD_ALLTIME_STATS
    });
    APIUtils.loadStats("all");
  }


};
