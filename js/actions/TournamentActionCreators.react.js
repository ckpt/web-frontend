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

  saveResults: function(tournamentID, results, bountyhunters) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SAVE_RESULTS
    });
    APIUtils.saveTournamentResults(tournamentID, results, bountyhunters);
  },

  setHost: function(tournamentID, locationID) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SET_HOST
    });
    APIUtils.setTournamentHost(tournamentID, locationID);
  },

  addNoShow: function(tournamentID, playerID, reason) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.ADD_NOSHOW
    });
    APIUtils.addTournamentNoShow(tournamentID, playerID, reason);
  },

  removeNoShow: function(tournamentID, playerID, reason) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.REMOVE_NOSHOW
    });
    APIUtils.removeTournamentNoShow(tournamentID, playerID);
  },

};
