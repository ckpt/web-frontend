"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var APIUtils = require("../utils/APIUtils.js");

var ActionTypes = CKPTConstants.ActionTypes;

module.exports = {

  login: function(username, password) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOGIN_REQUEST,
      username: username,
      password: password
    });
    APIUtils.login(username, password);
  },

  logout: function() {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOGOUT
    });
  }

};
