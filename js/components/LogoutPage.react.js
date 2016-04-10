"use strict";

var React = require("react");
var ReactRouter = require("react-router");
var History = ReactRouter.History;
var SessionActionCreators = require("../actions/SessionActionCreators.react");

var LogoutPage = React.createClass({

  displayName: "Logout page",
  mixins: [History],

  componentDidMount: function() {
    SessionActionCreators.logout();
    this.history.push("/");
  },

  render: function() {
    return <p>Utlogging...</p>;
  }

});

module.exports = LogoutPage;
