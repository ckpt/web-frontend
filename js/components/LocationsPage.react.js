"use strict";

var React = require("react");

var LocationStore = require("../stores/LocationStore.react");
var PlayerStore = require("../stores/PlayerStore.react");
var TournamentStore = require("../stores/TournamentStore.react");
var LocationActionCreators = require("../actions/LocationActionCreators.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var TournamentActionCreators = require("../actions/TournamentActionCreators.react");
var Authentication = require("../utils/Authentication");

var LocationPanel = require("./LocationPanel.react.js");
var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);
var _ = require("underscore");

var LocationsPage = React.createClass({

  displayName: "Locations Page",
  mixins: [ Authentication ],

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

  _hostedTournaments: function(uuid) {
    var tournaments = TournamentStore.getFromLocation(uuid);
    return _.reject(tournaments, function(t) {
      return !t.played || t.season !== this.props.currentSeason || moment().isBefore(t.info.scheduled);
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
    if (items.length === 1) {
      // FIXME
      var firstnick = this._lookupHostPlayerNick(items[0].host);
      var firsthosted = this._hostedTournaments(items[0].uuid);
      return [<LocationPanel location={items[0]} hostNick={firstnick} hosted={firsthosted} />];
    }

    for (var i = 0; i < items.length; i++) {
      var nick = this._lookupHostPlayerNick(items[i].host);
      var hosted = this._hostedTournaments(items[0].uuid);
      var loc = <LocationPanel location={items[i]} hostNick={nick} hosted={hosted} />;
      currentrow.push(loc);
      if ( (i + 1) % 2 === 0 ) {
        rows.push(_.copy(currentrow));
        currentrow = [];
      }
    }

    return rows;
  },

  render: function() {
    var locationrows = this._makeRows(this.state.locations);

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
