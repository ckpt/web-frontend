"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var APIUtils = require("../utils/APIUtils.js");

var ActionTypes = CKPTConstants.ActionTypes;

module.exports = {

  loadSeason: function(season) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOAD_CURRENT_SEASON_STANDINGS,
      season: season
    });
    APIUtils.loadSeason(season);
  }

};
