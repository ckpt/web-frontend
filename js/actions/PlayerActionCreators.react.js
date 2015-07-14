"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var APIUtils = require("../utils/APIUtils.js");

var ActionTypes = CKPTConstants.ActionTypes;

module.exports = {

  loadPlayers: function() {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOAD_PLAYERS
    });
    APIUtils.loadPlayers();
  },

  savePlayerProfile: function(uuid, profile) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SAVE_PLAYER_PROFILE,
      uuid: uuid,
      profile: profile
    });

    APIUtils.savePlayerProfile(uuid, profile);
  }

};
