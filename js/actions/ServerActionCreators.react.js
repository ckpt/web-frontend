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

  receiveQuotes: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.RECIEVE_QUOTES,
      json: json,
      errors: errors
    });
  },

  receiveStandings: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.RECIEVE_STANDINGS,
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
