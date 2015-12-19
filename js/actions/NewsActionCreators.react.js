"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var APIUtils = require("../utils/APIUtils.js");

var ActionTypes = CKPTConstants.ActionTypes;

module.exports = {

  loadNewsItems: function() {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOAD_NEWS_ITEMS
    });
    APIUtils.loadNewsItems();
  },

  createNewsItem: function(itemData) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SAVE_NEWS_ITEM
    });
    APIUtils.createNewsItem(itemData);
  },

  updateNewsItem: function(uuid, itemData) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.SAVE_NEWS_ITEM
    });
    APIUtils.updateNewsItem(uuid, itemData);
  },

  addComment: function(uuid, commentData) {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.ADD_NEWS_COMMENT
    });
    APIUtils.addNewsComment(uuid, commentData);
  },




};
