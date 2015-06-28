"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var APIUtils = require("../utils/APIUtils.js");

var ActionTypes = CKPTConstants.ActionTypes;

module.exports = {

  loadTasks: function() {
    CKPTDispatcher.handleViewAction({
      type: ActionTypes.LOAD_TASKS
    });
    APIUtils.loadTasks();
  },

  loadTask: function(taskId) {
    CKPTDispatcher.handleServerAction({
      type: ActionTypes.LOAD_TASK,
      taskId: taskId
    });
    APIUtils.loadTask(taskId);
  }
};
