"use strict";

var React = require("react");
var Pager = require("react-bootstrap").Pager;
var PageItem = require("react-bootstrap").PageItem;
var StandingsTable = require("./StandingsTable.react");
var ResultsTable = require("./ResultsTable.react");

var PlayerStore = require("../stores/PlayerStore.react");
var StandingsStore = require("../stores/StandingsStore.react");
var TournamentStore = require("../stores/TournamentStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var StandingsActionCreators = require("../actions/StandingsActionCreators.react");
var TournamentActionCreators = require("../actions/TournamentActionCreators.react");
var Authentication = require("../utils/Authentication");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var _ = require("underscore");

var StandingsPage = React.createClass({

  displayName: "Standings Page",
  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      currentStandings: this._getCurrentStandings(),
      currentResults: [],
      currentSeason: null,
      currentLeaderNick: this._getLeaderNick(),
      currentPlayer: PlayerStore.getFromUser(this.props.username),
      errors: []
    };
  },

  componentDidMount: function() {
    PlayerStore.addChangeListener(this._onChange);
    StandingsStore.addChangeListener(this._onChange);
    TournamentStore.addChangeListener(this._onChange);

    PlayerActionCreators.loadPlayers();
    TournamentActionCreators.loadTournaments();
    StandingsActionCreators.loadSeason(this.state.currentSeason || this.props.currentSeason);
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
    StandingsStore.removeChangeListener(this._onChange);
    TournamentStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      currentStandings: this._getCurrentStandings(),
      currentSeason: StandingsStore.getSeason(),
      currentResults: this._getSeasonResults(),
      currentLeaderNick: this._getLeaderNick(),
      currentPlayer: PlayerStore.getFromUser(this.props.username),
      quotes: PlayerStore.getQuotes(),
      errors: [
        PlayerStore.getErrors() +
        StandingsStore.getErrors() +
        TournamentStore.getErrors()
      ]
    });
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

  _getSeasonResults: function() {
    var ret = [];
    if (!this.state.currentSeason) {
      return ret;
    }

    var tournaments = TournamentStore.getPlayedTournamentsBySeason(this.state.currentSeason);

    if (!tournaments) {
      return ret;
    }

    tournaments.forEach(function (t) {
      var date = moment(t.info.scheduled).format("DD.MM.YY");
      var nicks = _.map(t.result, function(r) {
        var player = PlayerStore.getFromUUID(r);
        var nick = player ? player.nick : null;
        return nick;
      });

      ret.push(_.flatten([date, nicks]));
    });

    return ret;
  },

  _getCurrentStandings: function() {
    var ret = {
      byWinnings: [],
      byAvgPlace: [],
      byPoints: [],
      byHeadsUp: []
    };
    var standings = StandingsStore.getStandings(true);

    if (!standings) {
      return ret;
    }
    standings.byWinnings.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      if (!entry.playedEnough) {
        nick += " *";
      }
      ret.byWinnings.push([nick, entry.winnings]);
    });
    standings.byAvgPlace.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byAvgPlace.push([nick, entry.avgPlace.toFixed(2)]);
    });
    standings.byPoints.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byPoints.push([nick, entry.points]);
    });
    standings.byHeadsUp.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byHeadsUp.push([nick, entry.headsUp, entry.wins]);
    });

    return ret;
  },

  _changeSeason: function(season) {
    StandingsActionCreators.loadSeason(season);
    this.setState({
      currentSeason: season
    });
    this._getSeasonResults();
    React.findDOMNode(this.refs.resultheader).click();
  },

  render: function() {
    var allSeasons = TournamentStore.getAllSeasons();
    var firstSeason = _.min(allSeasons);
    var season = this.state.currentSeason == "all" ? "alle år" : this.state.currentSeason;
    var results = this.state.currentSeason != "all" ?
    <div className="row">
      <div className="col-lg-12">
        <ResultsTable entries={this.state.currentResults} title="Spilte turneringer" />
      </div>
    </div> : "";

    var disablePrev = this.state.currentSeason == firstSeason || this.state.currentSeason == "all";
    var prevItem = <PageItem disabled={disablePrev} onSelect={this._changeSeason.bind(this, this.state.currentSeason - 1)}>&larr; Forrige sesong</PageItem>;

    var allItem = this.state.currentSeason == "all" ?
    <PageItem onSelect={this._changeSeason.bind(this, this.props.currentSeason)}>{this.props.currentSeason}</PageItem> :
    <PageItem onSelect={this._changeSeason.bind(this, "all")}>Alle år</PageItem>;

    var disableNext = this.state.currentSeason == this.props.currentSeason || this.state.currentSeason == "all";
    var nextItem = <PageItem disabled={disableNext} onSelect={this._changeSeason.bind(this, this.state.currentSeason + 1)}>Neste sesong &rarr;</PageItem>;

    return (
      <div id="page-wrapper">
        <div className="row">
          <div className="col-lg-12">
            <div className="pull-left">
              <h3><i ref="resultheader" className="fa fa-table fa-fw"></i> Resultater og tabeller for {season}</h3>
            </div>
            <div className="pull-right">
              <Pager>
                {prevItem}
                {allItem}
                {nextItem}
              </Pager>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            {results}
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byWinnings}
                                headings={["Nick", "Gevinst"]}
                                title="Gevinsttabell" />
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byAvgPlace}
                                headings={["Nick", "Plassiffer"]}
                                title="Plassiffer" />
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byPoints}
                                headings={["Nick", "Poeng"]}
                                title="Lavpoeng" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = StandingsPage;
