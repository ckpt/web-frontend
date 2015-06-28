"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var SessionActionCreators = require("../actions/SessionActionCreators.react");

var LogoutPage = React.createClass({

  displayName: "Logout page",
  mixins: [Navigation],

  componentDidMount: function() {
    SessionActionCreators.logout();
    this.transitionTo("/");
  },

  render: function() {
    return <p>Utlogging...</p>;
  }

});

module.exports = LogoutPage;
