"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

var ActionTypes = CKPTConstants.ActionTypes;
var CHANGE_EVENT = "change";

// Load an access token from the session storage, you might want to implement
// a "remember me" using localSgorage
var _accessToken = sessionStorage.getItem("accessToken");
var _username = sessionStorage.getItem("username");
var _admin = (sessionStorage.getItem("isAdminToken") === "true");
var _errors = [];

var SessionStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  isLoggedIn: function() {
    return _accessToken ? true : false;
  },

  isAdmin: function() {
    return _admin;
  },

  getAccessToken: function() {
    return _accessToken;
  },

  getUsername: function() {
    return _username;
  },

  getErrors: function() {
    return _errors;
  }

});

SessionStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.LOGIN_RESPONSE:
      console.log("Got LOGIN_RESPONSE with action:");
      console.log(action);
      if (action.json) {
        var userdata = JSON.parse(action.json);
        _accessToken = userdata.apikey;
        _username = userdata.username;
        _admin = userdata.admin;
        // Token will always live in the session, so that the API can grab it with no hassle
        sessionStorage.setItem("accessToken", _accessToken);
        sessionStorage.setItem("username", _username);
        sessionStorage.setItem("isAdminToken", _admin);
      }
      if (action.errors) {
        _errors = action.errors;
      }
      SessionStore.emitChange();
      break;

    case ActionTypes.LOGOUT:
      console.log("Got LOGOUT action, removing all user info");
      _accessToken = null;
      _username = null;
      _admin = false;
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("username");
      SessionStore.emitChange();
      break;
  }

  return true;
});

module.exports = SessionStore;
