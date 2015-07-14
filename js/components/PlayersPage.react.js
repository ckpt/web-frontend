"use strict";

var React = require("react");

var PlayerStore = require("../stores/PlayerStore.react");
var TournamentStore = require("../stores/TournamentStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var TournamentActionCreators = require("../actions/TournamentActionCreators.react");
var Authentication = require("../utils/Authentication");

var PlayerSummaryPanel = require("./PlayerSummaryPanel.react.js");
var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);
var _ = require("underscore");

var PlayersPage = React.createClass({

  displayName: "Players Page",
  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      players: PlayerStore.getPlayers(),
      errors: []
    };
  },

  componentDidMount: function() {
    PlayerStore.addChangeListener(this._onChange);
    TournamentStore.addChangeListener(this._onChange);
    PlayerActionCreators.loadPlayers();
    TournamentActionCreators.loadTournaments();
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
    TournamentStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      players: PlayerStore.getPlayers(),
      errors: [
        PlayerStore.getErrors()
      ]
    });
  },

  _makeRows: function(items) {
    var rows = [];
    var currentrow = [];

    for (var i = 0; i < items.length; i++) {
      var badges = [];
      if (items[i].nick === "Bjøro") {
        badges.push({ desc: "Spillernes taper", icon: "thumbs-down" });
      }
      if (items[i].nick === "Lars Vegas") {
        badges.push({ desc: "Spillernes favoritt", icon: "thumbs-up" });
        badges.push({ desc: "Månedens krill", icon: "frown-o" });
      }
      if (items[i].nick === "Pæra") {
        badges.push({ desc: "Har ledertrøya", icon: "trophy"});
        badges.push({ desc: "Månedens spiller", icon: "rocket"});
      }

      var player = <PlayerSummaryPanel player={items[i]} xtraicons={badges} key={"playersummary-" + i} />;
      currentrow.push(player);
      if ( (i + 1) % 3 === 0 ) {
        rows.push(_.clone(currentrow));
        currentrow = [];
      }
    }

    if (currentrow.length) {
      rows.push(_.clone(currentrow));
    }
    return rows;
  },

  render: function() {
    var playerrows = this._makeRows(_.sortBy(this.state.players, function(p) { return p.nick; }));

    return (
      <div id="page-wrapper">
        {playerrows.map(function(row, i) {
          return (
            <div className="row" key={"player-row-" + i}>
            <p></p>
              {row}
            </div>
          );
         })}
      </div>
    );
  }
});

module.exports = PlayersPage;
