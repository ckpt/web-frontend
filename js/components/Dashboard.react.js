"use strict";

var React = require("react");
var OverviewSection = require("./OverviewSection.react");
var TimelineSection = require("./TimelineSection.react");
var StandingsTable = require("./StandingsTable.react");
var QuotePanel = require("./QuotePanel.react");

var TaskStore = require("../stores/TaskStore.react");
var PlayerStore = require("../stores/PlayerStore.react");
var StandingsStore = require("../stores/StandingsStore.react");
var TaskActionCreators = require("../actions/TaskActionCreators.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var StandingsActionCreators = require("../actions/StandingsActionCreators.react");
var Authentication = require("../utils/Authentication");

var Dashboard = React.createClass({

  displayName: "Dashboard Page",
  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      tasks: TaskStore.numTasks(),
      currentStandings: this._getCurrentStandings(),
      currentSeason: StandingsStore.getSeason(),
      currentLeaderNick: this._getLeaderNick(),
      currentPlayer: PlayerStore.getFromUser(this.props.username),
      nextTournament: null,
      quotes: PlayerStore.getQuotes(),
      errors: []
    };
  },

  componentDidMount: function() {
    TaskStore.addChangeListener(this._onChange);
    PlayerStore.addChangeListener(this._onChange);
    StandingsStore.addChangeListener(this._onChange);
    PlayerActionCreators.loadPlayers();
    TaskActionCreators.loadTasks();
    StandingsActionCreators.loadCurrentSeason();
  },

  componentWillUnmount: function() {
    TaskStore.removeChangeListener(this._onChange);
    PlayerStore.removeChangeListener(this._onChange);
    StandingsStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      tasks: TaskStore.numTasks(),
      currentStandings: this._getCurrentStandings(),
      currentSeason: StandingsStore.getSeason(),
      currentLeaderNick: this._getLeaderNick(),
      currentPlayer: PlayerStore.getFromUser(this.props.username),
      quotes: PlayerStore.getQuotes(),
      errors: [
        TaskStore.getErrors() +
        PlayerStore.getErrors() +
        StandingsStore.getErrors()
      ]
    });
  },

  _userWinnings: function() {
    var player = this.state.currentPlayer;
    if (!player) {
      return null;
    }

    var playerStanding = StandingsStore.getForPlayer(player.uuid);
    if (playerStanding) {
      return playerStanding.winnings;
    } else {
      return null;
    }
  },

  _getLeaderNick: function() {
    var leader = StandingsStore.getLeader();
    if (leader && leader.uuid) {
      var player = PlayerStore.getFromUUID(leader.uuid);
      if (player) {
        return player.nick;
      }
    return null;
    }
  },

  _getCurrentStandings: function() {
    var ret = [];
    var standings = StandingsStore.getStandings();
    if (!standings || !standings.length) {
      ret.push([]);
      return ret;
    }
    standings.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      if (!entry.playedEnough) {
        nick += " *";
      }
      ret.push([nick, entry.winnings]);
    });

    return ret;
  },

  _makeOverviewItem: function(icon, maintext, subtext, color, link) {
    return {
      icon: icon,
      maintext: maintext,
      subtext: subtext,
      color: color,
      link: link
    };
  },

  _makeOverviewItems: function() {
    var userWinnings = this._userWinnings();
    var tasksItem = this._makeOverviewItem("tasks", this.state.tasks,
                                           "Uløste oppgaver!",
                                           this.state.tasks > 0 ? "info" : "success",
                                           { target: "#", text: "Se hvilke" });
    var playerItem = this._makeOverviewItem("money", userWinnings,
                                            "Gevinst i " + this.state.currentSeason,
                                            userWinnings < 0 ? "red" : "success",
                                            { target: "#", text: "Se årets resultater" });
    var leaderItem = this._makeOverviewItem("trophy", this.state.currentLeaderNick,
                                            "Leder årets sesong", "yellow",
                                            { target: "#", text: "Se sammenlagtoversikt" });

    return [playerItem, tasksItem, leaderItem];
  },

  render: function() {
    var overviewItems = this._makeOverviewItems();

    return (
      <div id="page-wrapper">
        <div className="row">
          <OverviewSection items={overviewItems} />
        </div>
        <div className="row">
          <TimelineSection />
          <div className="col-lg-4">
            <StandingsTable entries={this.state.currentStandings}
                            headings={["Nick", "Gevinst"]}
                            title="Tabellen" />
            <QuotePanel quotes={this.state.quotes} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
