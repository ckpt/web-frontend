"use strict";

var keyMirror = require("keymirror");

// var APIRoot = "https://backend-services-knumor-1.c9.io";
var APIRoot = "http://api.ckpt.no:8000";

module.exports = {

  API_ROOT: APIRoot,

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
    RECIEVE_QUOTES: null,
    RECIEVE_PLAYER: null,
    SAVE_PLAYER_PROFILE: null,

    // Standings
    LOAD_SEASON_STANDINGS: null,
    LOAD_ALLTIME_STANDINGS: null,
    RECIEVE_STANDINGS: null,

    // Stats
    LOAD_SEASON_STATS: null,
    LOAD_ALLTIME_STATS: null,
    RECIEVE_STATS: null,
    RECIEVE_TITLES: null,

    // Locations
    LOAD_LOCATIONS: null,
    RECIEVE_LOCATIONS: null,

    // Tournaments
    LOAD_TOURNAMENTS: null,
    RECIEVE_TOURNAMENTS: null,
    SAVE_RESULTS: null,

    // News
    LOAD_NEWS_ITEMS: null,
    RECIEVE_NEWS_ITEMS: null,
    SAVE_NEWS_ITEM: null,
    ADD_COMMENT: null,
    REMOVE_COMMENT: null

  })

};
