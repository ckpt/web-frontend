"use strict";

var keyMirror = require("keymirror");

// var APIRoot = "http://localhost:3002";

module.exports = {

  //  APIEndpoints: {
  //    LOGIN:          APIRoot + "/v1/login",
  //    REGISTRATION:   APIRoot + "/v1/users",
  //    STORIES:        APIRoot + "/v1/stories"
  //  },

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  }),

  ActionTypes: keyMirror({
    // Session
    LOGIN_REQUEST: null,
    LOGIN_RESPONSE: null,
    LOGOUT: null,

    // Routes
    //REDIRECT: null,

    // Tasks
    LOAD_TASKS: null,
    LOAD_TASK: null,
    RECIEVE_TASKS: null,
    RECIEVE_TASK: null,

    // Players
    LOAD_PLAYERS: null,
    RECIEVE_PLAYERS: null,
    RECIEVE_PLAYER: null

  })

};
