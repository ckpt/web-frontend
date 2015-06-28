"use strict";

var SessionStore = require("../stores/SessionStore.react");

module.exports = {

  statics: {
    willTransitionTo: function (transition) {
      var nextPath = transition.path;
      if (!SessionStore.isLoggedIn()) {
        transition.redirect("/login", {},
          { "nextPath": nextPath });
      }
    }
  }

};
