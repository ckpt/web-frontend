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

  receiveStats: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.RECIEVE_STATS,
      json: json,
      errors: errors
    });
  },

  receiveTitles: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.RECIEVE_TITLES,
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
  },

  receiveLocations: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.RECIEVE_LOCATIONS,
      json: json,
      errors: errors
    });
  },

  receiveTournaments: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.RECIEVE_TOURNAMENTS,
      json: json,
      errors: errors
    });
  },

  receiveNewsItems: function(json, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.RECIEVE_NEWS_ITEMS,
      json: json,
      errors: errors
    });
  },

  saveNewsItem: function(itemData, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.SAVE_NEWS_ITEM_COMPLETE,
      item: itemData,
      errors: errors
    });
  },

  addNewsComment: function(commentData, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.ADD_NEWS_COMMENT_COMPLETE,
      comment: commentData,
      errors: errors
    });
  },

  addDebt: function(debt, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.ADD_PLAYER_DEBT_COMPLETE,
      debt: debt,
      errors: errors
    });
  },

  settleDebt: function(errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.SETTLE_PLAYER_DEBT_COMPLETE,
      errors: errors
    });
  },

  setVotes: function(votes, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.SET_PLAYER_VOTES_COMPLETE,
      votes: votes,
      errors: errors
    });
  },

  setGossip: function(gossip, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.SET_PLAYER_GOSSIP_COMPLETE,
      gossip: gossip,
      errors: errors
    });
  },


  addNoShow: function(noshow, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.ADD_NOSHOW_COMPLETE,
      noshow: noshow,
      errors: errors
    });
  },

  removeNoShow: function(errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.REMOVE_NOSHOW_COMPLETE,
      errors: errors
    });
  },

  saveTournamentResults: function(uuid, results, errors) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.SAVE_RESULTS_COMPLETE,
      uuid: uuid,
      results: results,
      errors: errors
    });
  },


};
