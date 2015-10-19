"use strict";

var React = require("react");

var PlayerStore = require("../stores/PlayerStore.react");
var TournamentStore = require("../stores/TournamentStore.react");
var LocationStore = require("../stores/LocationStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var TournamentActionCreators = require("../actions/TournamentActionCreators.react");
var LocationActionCreators = require("../actions/LocationActionCreators.react");
var Authentication = require("../utils/Authentication");

var TournamentInfoPanel = require("./TournamentInfoPanel.react.js");
var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);
var _ = require("underscore");

var CalendarPage = React.createClass({

  displayName: "Tournament calendar Page",
  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      tournaments: TournamentStore.getTournamentsBySeason(this.props.currentSeason),
      errors: []
    };
  },

  componentDidMount: function() {
    PlayerStore.addChangeListener(this._onChange);
    TournamentStore.addChangeListener(this._onChange);
    LocationStore.addChangeListener(this._onChange);
    PlayerActionCreators.loadPlayers();
    TournamentActionCreators.loadTournaments();
    LocationActionCreators.loadLocations();
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
    TournamentStore.removeChangeListener(this._onChange);
    LocationStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      tournaments: TournamentStore.getTournamentsBySeason(this.props.currentSeason),
      errors: [
        PlayerStore.getErrors() +
        TournamentStore.getErrors() +
        LocationStore.getErrors()
      ]
    });
  },

  _makePanelData: function() {
    var panels = [];
    
    if (!this.state.tournaments) {
      return panels;
    }

    for (var i = 0; i < this.state.tournaments.length; i++) {
      var curT = this.state.tournaments[i];
      var paneldata = {
        tournament: curT
      };
      
      // location
      
      var loc = LocationStore.getFromUUID(curT.info.location);
      paneldata.locationName = loc ? loc.profile.name : "Ikke kjent";
      
      // TODO: catering
      paneldata.cateringNick = "Frank";
      
      panels.push(_.clone(paneldata));
    }
    return panels;
  },

  render: function() {
    var panels = this._makePanelData();

    return (
      <div id="page-wrapper">
        <div className="row">
          <p></p>
          {panels.map(function(p, i) {
            return (
              <TournamentInfoPanel tournament={p.tournament}
                                   locationName={p.locationName}
                                   cateringNick={p.cateringNick}
                                   key={"tnr-info-" + i}/>
            );
          })}
        </div>
      </div>
    );
  }
});

module.exports = CalendarPage;
