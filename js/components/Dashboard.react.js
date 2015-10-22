"use strict";

var React = require("react");
var OverviewSection = require("./OverviewSection.react");
var TimelineSection = require("./TimelineSection.react");
var StandingsTable = require("./StandingsTable.react");
var QuotePanel = require("./QuotePanel.react");

var TaskStore = require("../stores/TaskStore.react");
var PlayerStore = require("../stores/PlayerStore.react");
var StandingsStore = require("../stores/StandingsStore.react");
var LocationStore = require("../stores/LocationStore.react");
var TournamentStore = require("../stores/TournamentStore.react");
var NewsStore = require("../stores/NewsStore.react");
var TaskActionCreators = require("../actions/TaskActionCreators.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var StandingsActionCreators = require("../actions/StandingsActionCreators.react");
var LocationActionCreators = require("../actions/LocationActionCreators.react");
var TournamentActionCreators = require("../actions/TournamentActionCreators.react");
var NewsActionCreators = require("../actions/NewsActionCreators.react");
var Authentication = require("../utils/Authentication");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

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
      nextTournament: this._nextTournamentDetails(),
      quotes: PlayerStore.getQuotes(),
      news: NewsStore.getNewsItems(),
      errors: []
    };
  },

  componentDidMount: function() {
    TaskStore.addChangeListener(this._onChange);
    PlayerStore.addChangeListener(this._onChange);
    StandingsStore.addChangeListener(this._onChange);
    LocationStore.addChangeListener(this._onChange);
    TournamentStore.addChangeListener(this._onChange);
    NewsStore.addChangeListener(this._onChange);

    PlayerActionCreators.loadPlayers();
    LocationActionCreators.loadLocations();
    TournamentActionCreators.loadTournaments();
    NewsActionCreators.loadNewsItems();
    TaskActionCreators.loadTasks();
    StandingsActionCreators.loadSeason(this.props.currentSeason);
  },

  componentWillUnmount: function() {
    TaskStore.removeChangeListener(this._onChange);
    PlayerStore.removeChangeListener(this._onChange);
    StandingsStore.removeChangeListener(this._onChange);
    LocationStore.removeChangeListener(this._onChange);
    TournamentStore.removeChangeListener(this._onChange);
    NewsStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      tasks: TaskStore.numTasks(),
      currentStandings: this._getCurrentStandings(),
      currentSeason: StandingsStore.getSeason(),
      currentLeaderNick: this._getLeaderNick(),
      currentPlayer: PlayerStore.getFromUser(this.props.username),
      nextTournament: this._nextTournamentDetails(),
      quotes: PlayerStore.getQuotes(),
      news: NewsStore.getNewsItems(),
      errors: [
        TaskStore.getErrors() +
        PlayerStore.getErrors() +
        StandingsStore.getErrors() +
        LocationStore.getErrors() +
        TournamentStore.getErrors()
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

  _nextTournamentDetails: function() {
    var tournament = TournamentStore.getNext();
    if (!tournament || !tournament.info) {
      return { where: "Ukjent", when: "ikke fastlagt" };
    }
    var when = moment(tournament.info.scheduled).format("DD.MM");
    var location = LocationStore.getFromUUID(tournament.info.location);
    if (!location || !location.profile || !location.profile.name) {
      return { where: "Ukjent", when: when};
    }
    return { where: location.profile.name, when: when };
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
                                            { target: "#/standings", text: "Se årets resultater" });
    var leaderItem = this._makeOverviewItem("trophy", this.state.currentLeaderNick,
                                            "Leder årets sesong", "yellow",
                                            { target: "#/overview", text: "Se sammenlagtoversikt" });
    var tournamentItem = this._makeOverviewItem("home", this.state.nextTournament.where,
                                            "Neste turnering er " + this.state.nextTournament.when,
                                            "info", { target: "#/locations", text: "Mer informasjon" });

    return [playerItem, tasksItem, leaderItem, tournamentItem];
  },

  _makeTimelineItems: function() {
    return this.state.news.map(function(item, i) {
      var player = PlayerStore.getFromUUID(item.author);
      var nick = "Ukjent";
      if (player) {
        nick = player.nick;
      }
      item.authorNick = nick;
      return item;
    });
  },

  render: function() {
    var overviewItems = this._makeOverviewItems();
    var timelineItems = this._makeTimelineItems();

    return (
      <div id="page-wrapper">
        <div className="row">
          <OverviewSection items={overviewItems} />
        </div>
        <div className="row">
          <TimelineSection heading="Pokernytt" items={timelineItems}
                           link={{target: "#/news", text: "Alle nyheter og bidrag"}}/>
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
