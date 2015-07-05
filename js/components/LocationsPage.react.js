"use strict";

var React = require("react");

var LocationStore = require("../stores/LocationStore.react");
var LocationActionCreators = require("../actions/LocationActionCreators.react");
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
    LocationActionCreators.loadLocations();
  },

  componentWillUnmount: function() {
    LocationStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      locations: LocationStore.getLocations(),
      errors: [
        LocationStore.getErrors()
      ]
    });
  },

  _makeRows: function(items) {
    var rows = [];
    var currentrow = [];
    if (items.length === 1) {
      return [<LocationPanel location={items[0]} />];
    }

    for (var i = 0; i < items.length; i++) {
      var loc = <LocationPanel location={items[i]} />;
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
              {row}
            </div>
          );
         })}
      </div>
    );
  }
});

module.exports = LocationsPage;
