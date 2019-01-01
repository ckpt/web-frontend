"use strict";

var React = require("react");
var Pager = require("react-bootstrap").Pager;
var PageItem = require("react-bootstrap").PageItem;
var StandingsTable = require("./StandingsTable.react");
var ResultsTable = require("./ResultsTable.react");

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var PlayerStore = require("../stores/PlayerStore.react");
var StandingsStore = require("../stores/StandingsStore.react");
var StatsStore = require("../stores/StatsStore.react");
var TournamentStore = require("../stores/TournamentStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var StandingsActionCreators = require("../actions/StandingsActionCreators.react");
var StatsActionCreators = require("../actions/StatsActionCreators.react");
var TournamentActionCreators = require("../actions/TournamentActionCreators.react");

var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var _ = require("underscore");

var StandingsPage = React.createClass({

  displayName: "Standings Page",

  getInitialState: function() {
    var ret = {
      byWinnings: [],
      byAvgPlace: [],
      byPoints: [],
      byHeadsUp: [],
      byKnockouts: [],
      byWinRatio: [],
      byWinRatioTotal: [],
      byDaysSinceHeadsUp: [],
      byForm: [],
      byDaysInYellow: [],
      byPlayerOfTheMonth: [],
      byLoserOfTheMonth: [],
      byBHOfTheMonth: [],
      byAbsence: []
    };

    return {
      currentStandings: ret,
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
    StatsStore.addChangeListener(this._onChange);
    TournamentStore.addChangeListener(this._onChange);

    PlayerActionCreators.loadPlayers();
    TournamentActionCreators.loadTournaments();
    StandingsActionCreators.loadSeason(this.state.currentSeason || this.props.currentSeason);
    StatsActionCreators.loadSeason(this.state.currentSeason || this.props.currentSeason);
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
    StandingsStore.removeChangeListener(this._onChange);
    StatsStore.removeChangeListener(this._onChange);
    TournamentStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    var reloadNeeded = !TournamentStore.isValid("tournaments");
    setTimeout(function() {
      if (!CKPTDispatcher.isDispatching() && reloadNeeded) {
        TournamentActionCreators.loadTournaments();
        StandingsActionCreators.loadSeason(this.state.currentSeason || this.props.currentSeason);
        StatsActionCreators.loadSeason(this.state.currentSeason || this.props.currentSeason);
      }
    }, 5);

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
        StatsStore.getErrors() +
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
      byKnockouts: [],
      byHeadsUp: [],
      byWinRatio: [],
      byWinRatioTotal: [],
      byDaysSinceHeadsUp: [],
      byForm: [],
      byDaysInYellow: [],
      byPlayerOfTheMonth: [],
      byLoserOfTheMonth: [],
      byBHOfTheMonth: [],
      byAbsence: []
    };
    var standings = StandingsStore.getStandings(true);
    var yellowPeriods = StatsStore.getLongestYellowPeriods();
    var bestByPlayer = StatsStore.getNumBestMonths();
    var worstByPlayer = StatsStore.getNumWorstMonths();
    var bhByPlayer = StatsStore.getNumBHMonths();
    var currentForm = StandingsStore.getCurrentForm();
    var lastHeadsUp = StandingsStore.getLastHeadsUp();

    if (!standings) {
      return ret;
    }

    if (!standings.byWinnings) {
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
    standings.byKnockouts.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byKnockouts.push([nick, entry.knockouts]);
    });
    standings.byHeadsUp.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byHeadsUp.push([nick, ((entry.headsUp / entry.played) * 100).toFixed(1) + "%",
                          ((entry.wins / entry.headsUp) * 100).toFixed(1) + "%"]);
    });
    standings.byWinRatio.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byWinRatio.push([nick, ((entry.wins / entry.played) * 100).toFixed(1) + "%"]);
    });
    standings.byWinRatioTotal.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byWinRatioTotal.push([nick, ((entry.wins / entry.numTotal) * 100).toFixed(1) + "%"]);
    });
    yellowPeriods.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      var days = moment(entry.to).diff(moment(entry.from), "days");
      ret.byDaysInYellow.push([nick, days + " dager"]);
    });
    bestByPlayer.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry[0]);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byPlayerOfTheMonth.push([nick, entry[1]]);
    });
    worstByPlayer.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry[0]);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byLoserOfTheMonth.push([nick, entry[1]]);
    });
    bhByPlayer.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry[0]);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byBHOfTheMonth.push([nick, entry[1]]);
    });
    standings.byNumPlayed.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byAbsence.push([nick, (entry.numTotal - entry.played) + " turneringer",
                                (((entry.numTotal - entry.played) / entry.numTotal) * 100).toFixed(1) + "%"]);
    });
    currentForm.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byForm.push([nick, _.pluck(entry.form, "place").join(" - ")]);
    });
    lastHeadsUp.forEach(function (entry) {
      var player = PlayerStore.getFromUUID(entry.uuid);
      if (!player) { return [null, null]; }
      var nick = player.nick;
      ret.byDaysSinceHeadsUp.push([nick, moment().diff(moment(entry.last), "days") + " dager (" + moment(entry.last).format("DD.MM.YYYY") + ")"]);
    });

    return ret;
  },

  _changeSeason: function(season) {
    StandingsActionCreators.loadSeason(season);
    StatsActionCreators.loadSeason(season);
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

    var bountyhunter = (this.state.currentSeason == "all" || this.state.currentSeason >= 2019) ?
    <div className="col-lg-4 col-md-6 col-sm-12">
      <StandingsTable entries={this.state.currentStandings.byKnockouts}
                      headings={["Nick", "Antall knockouts"]}
                      title="Bounty Hunter" />
    </div> : "";

    var bhMonth = (this.state.currentSeason == "all" || this.state.currentSeason >= 2019) ?
    <div className="col-lg-4 col-md-6 col-sm-12">
      <StandingsTable entries={this.state.currentStandings.byBHOfTheMonth}
                      headings={["Nick", "Antall ganger"]}
                      title="Månedens Bounty Hunter" />
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
              {bountyhunter}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byWinRatio}
                                headings={["Nick", "Andel seiere"]}
                                title="Antall seiere basert på antall spilte turneringer" />
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byWinRatioTotal}
                                headings={["Nick", "Andel seiere"]}
                                title="Antall seiere basert på alle turneringer" />
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byHeadsUp}
                                headings={["Nick", "Heads Up", "Vunnet"]}
                                title="Heads Up" />
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byAbsence}
                                headings={["Nick", "Turneringer", "Prosent"]}
                                title="Fraværstabell" />
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byForm}
                                headings={["Nick", "Form"]}
                                title="Formtabell" />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byDaysInYellow}
                                headings={["Nick", "Dager med ledertrøya"]}
                                title="Lengste periode med ledertrøya" />
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byPlayerOfTheMonth}
                                headings={["Nick", "Antall ganger"]}
                                title="Månedens spiller" />
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byLoserOfTheMonth}
                                headings={["Nick", "Antall ganger"]}
                                title="Månedens krill" />
              </div>
              {bhMonth}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <StandingsTable entries={this.state.currentStandings.byDaysSinceHeadsUp}
                                headings={["Nick", "Sist heads up"]}
                                title="Sist spilleren var heads up" />
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = StandingsPage;
