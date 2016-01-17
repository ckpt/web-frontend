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
  },

  saveUserSettings: function(uuid, settings, password) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SAVE_USER_SETTINGS,
      uuid: uuid,
      settings: settings,
      password: password
    });

    APIUtils.saveUserSettings(uuid, settings, password);
  },

  settleDebt: function(uuid, debitor) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SETTLE_PLAYER_DEBT,
      uuid: uuid,
      debitor: debitor,
    });

    APIUtils.settleDebt(uuid, debitor);
  },

  addDebt: function(creditor, debitor, amount, reason) {
  CKPTDispatcher.handleViewAction({
    type: ActionTypes.ADD_PLAYER_DEBT,
    creditor: creditor,
    debitor: debitor,
    amount: amount,
    reason: reason,
  });

  APIUtils.addDebt(creditor, debitor, amount, reason);
  },

  setVotes: function(uuid, votes) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SET_PLAYER_VOTES,
      uuid: uuid,
      votes: votes,
    });

    APIUtils.setVotes(uuid, votes);
  },

  setGossip: function(uuid, gossip) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SET_PLAYER_GOSSIP,
      uuid: uuid,
      gossip: gossip,
    });

    APIUtils.setGossip(uuid, gossip);
  }


};
