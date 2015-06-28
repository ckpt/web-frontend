"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");

var ActionTypes = CKPTConstants.ActionTypes;

module.exports = {

  receiveTasks: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.RECIEVE_TASKS,
      json: json,
      errors: errors
    });
  },

  receivePlayers: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.RECIEVE_PLAYERS,
      json: json,
      errors: errors
    });
  },

  receiveLogin: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.LOGIN_RESPONSE,
      json: json,
      errors: errors
    });
  }
};
