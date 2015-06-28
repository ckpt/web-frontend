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
  }

};
