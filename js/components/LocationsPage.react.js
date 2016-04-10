"use strict";

var React = require("react");

var LocationStore = require("../stores/LocationStore.react");
var PlayerStore = require("../stores/PlayerStore.react");
var TournamentStore = require("../stores/TournamentStore.react");
var LocationActionCreators = require("../actions/LocationActionCreators.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var TournamentActionCreators = require("../actions/TournamentActionCreators.react");

var LocationPanel = require("./LocationPanel.react.js");
var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var _ = require("underscore");

var LocationsPage = React.createClass({

  displayName: "Locations Page",

  getInitialState: function() {
    return {
      locations: LocationStore.getLocations(),
      errors: []
    };
  },

  componentDidMount: function() {
    LocationStore.addChangeListener(this._onChange);
    PlayerStore.addChangeListener(this._onChange);
    TournamentStore.addChangeListener(this._onChange);
    LocationActionCreators.loadLocations();
    PlayerActionCreators.loadPlayers();
    TournamentActionCreators.loadTournaments();
  },

  componentWillUnmount: function() {
    LocationStore.removeChangeListener(this._onChange);
    PlayerStore.removeChangeListener(this._onChange);
    TournamentStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      locations: LocationStore.getLocations(),
      errors: [
        LocationStore.getErrors()
      ]
    });
  },

  _nextTournament: function(uuid) {
    var tournaments = TournamentStore.getFromLocation(uuid);
    var upcoming = _.sortBy(tournaments, function (t) { return t.info.scheduled; });
    var candidates = _.reject(upcoming, function (t) {
      return t.played || moment().isAfter(t.info.scheduled);
    });

    if (!candidates.length) {
      return null;
    }

    return candidates[0];
  },

  _hostedTournaments: function(uuid) {
    var tournaments = TournamentStore.getFromLocation(uuid);
    var season = this.props.currentSeason;
    return _.reject(tournaments, function(t) {
      return !t.played || t.info.season !== season || moment().isBefore(t.info.scheduled);
    });
  },

  _lookupHostPlayerNick: function(uuid) {
    var player = PlayerStore.getFromUUID(uuid);
    if (player && player.nick) {
      return player.nick;
    }
    return null;
  },

  _makeRows: function(items) {
    var rows = [];
    var currentrow = [];

    for (var i = 0; i < items.length; i++) {
      var nick = this._lookupHostPlayerNick(items[i].host);
      var hosted = this._hostedTournaments(items[i].uuid);
      var next = this._nextTournament(items[i].uuid);
      var loc = <LocationPanel location={items[i]} hostNick={nick} hosted={hosted} next={next} key={"locationpanel-" + i} />;
      currentrow.push(loc);
      if ( (i + 1) % 2 === 0 ) {
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
    var locationrows = this._makeRows(
        _.sortBy(
              _.filter(this.state.locations, function(l) { return l.active; }
              ),
          function(l) { return l.profile.name; })
        );

    return (
      <div id="page-wrapper">
        {locationrows.map(function(row, i) {
          return (
            <div className="row" key={"location-row-" + i}>
            <p></p>
              {row}
            </div>
          );
         })}
      </div>
    );
  }
});

module.exports = LocationsPage;
