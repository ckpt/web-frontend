"use strict";

var React = require("react");
var SessionActionCreators = require("../actions/SessionActionCreators.react");

var LogoutPage = React.createClass({

  displayName: "Logout page",

  componentDidMount: function() {
    SessionActionCreators.logout();
    this.props.history.push('/');
  },

  render: function() {
    return <p>Utlogging...</p>;
  }

});

module.exports = LogoutPage;
