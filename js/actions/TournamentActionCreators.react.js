"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var APIUtils = require("../utils/APIUtils.js");

var ActionTypes = CKPTConstants.ActionTypes;

module.exports = {

  loadTournaments: function() {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOAD_TOURNAMENTS
    });
    APIUtils.loadTournaments();
  },

  saveResults: function(tournamentID, results) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SAVE_RESULTS
    });
    APIUtils.saveTournamentResults(tournamentID, results);
  },

  setHost: function(tournamentID, locationID) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SET_HOST
    });
    APIUtils.setTournamentHost(tournamentID, locationID);
  },

};
