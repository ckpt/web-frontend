"use strict";

var React = require("react");

var PlayerStore = require("../stores/PlayerStore.react");
var TournamentStore = require("../stores/TournamentStore.react");
var StandingsStore = require("../stores/StandingsStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var TournamentActionCreators = require("../actions/TournamentActionCreators.react");
var StandingsActionCreators = require("../actions/StandingsActionCreators.react");

var PlayerSummaryPanel = require("./PlayerSummaryPanel.react.js");
var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var _ = require("underscore");

var PlayersPage = React.createClass({

  displayName: "Players Page",

  getDefaultProps: function() {
    return {
      footer: "Hittil i år:"
    };
  },

  getInitialState: function() {
    return {
      players: PlayerStore.getPlayers(),
      standings: StandingsStore.getStandings(),
      errors: []
    };
  },

  componentDidMount: function() {
    PlayerStore.addChangeListener(this._onChange);
    TournamentStore.addChangeListener(this._onChange);
    StandingsStore.addChangeListener(this._onChange);
    PlayerActionCreators.loadPlayers();
    TournamentActionCreators.loadTournaments();
    StandingsActionCreators.loadSeason(this.props.currentSeason);
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
    TournamentStore.removeChangeListener(this._onChange);
    StandingsStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      players: PlayerStore.getPlayers(),
      standings: StandingsStore.getStandings(),
      errors: [
        PlayerStore.getErrors() +
        StandingsStore.getErrors()
      ]
    });
  },

  _makeRows: function(items, winnings) {
    var rows = [];
    var currentrow = [];
    var leader = winnings && winnings.length ? winnings[0].uuid : null;
    var votes = PlayerStore.getVotes();

    for (var i = 0; i < items.length; i++) {
      var badges = [];
      // if (items[i].nick === "Lars Vegas") {
      //   badges.push({ desc: "Månedens krill", icon: "frown-o" });
      // }
      if (this.props.currentSeason != 'all') {
        if (leader == items[i].uuid) {
          badges.push({ desc: "Har ledertrøya", icon: "trophy"});
        }
        if (votes.winner == items[i].uuid) {
          badges.push({ desc: "Spillernes favoritt", icon: "thumbs-up" });
        }
        if (votes.loser == items[i].uuid) {
          badges.push({ desc: "Spillernes taper", icon: "thumbs-down" });
        }
      }
      // if (items[i].nick === "Pæra") {
      //   badges.push({ desc: "Månedens spiller", icon: "rocket"});
      // }

      var playerWinnings = _.findWhere(winnings, {uuid: items[i].uuid});
      var player = <PlayerSummaryPanel footer={this.props.footer} player={items[i]} winnings={playerWinnings} xtraicons={badges} key={"playersummary-" + i} />;
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
    var byWinnings = this.state.standings;
    var playerrows = this._makeRows(_.sortBy(this.state.players, function(p) { return p.nick; }), byWinnings);

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
