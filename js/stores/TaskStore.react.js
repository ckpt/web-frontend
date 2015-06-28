"use strict";

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var CKPTConstants = require("../constants/CKPTConstants.js");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

var ActionTypes = CKPTConstants.ActionTypes;
var CHANGE_EVENT = "change";

var _tasks = [];
var _errors = [];
var _task = { type: "", name: "" };

var TaskStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getTasks: function() {
    return _tasks;
  },

  getTask: function() {
    return _task;
  },

  getErrors: function() {
    return _errors;
  }

});

TaskStore.dispatchToken = CKPTDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECIEVE_TASKS:
      console.log("Got action RECIEVE_TASKS with data:");
      console.log(action);
      if (action.json) {
        var recievedTasks = JSON.parse(action.json);
        _tasks = recievedTasks;
        _errors = [];
      }
      if (action.errors) {
        _errors = action.errors;
      }
      TaskStore.emitChange();
      break;

    case ActionTypes.RECIEVE_TASK:
      if (action.json) {
        _task = action.json.task;
        _errors = [];
      }
      if (action.errors) {
        _errors = action.errors;
      }
      TaskStore.emitChange();
      break;
  }

  return true;
});

module.exports = TaskStore;
