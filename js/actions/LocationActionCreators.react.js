"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var APIUtils = require("../utils/APIUtils.js");

var ActionTypes = CKPTConstants.ActionTypes;

module.exports = {

  loadLocations: function() {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOAD_LOCATIONS
    });
    APIUtils.loadLocations();
  }

};
