"use strict";

var React = require("react");
var PlayersPage = require("./PlayersPage.react");

var StandingsSummaryPage = React.createClass({

  displayName: "Standings Summary Page",

  render: function() {

    return (
      <PlayersPage footer="Totalt for alle år:" currentSeason="all"/>
    );
  }
});

module.exports = StandingsSummaryPage;
