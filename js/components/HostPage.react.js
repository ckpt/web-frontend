var React = require("react");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var PlayerStore = require("../stores/PlayerStore.react");
var TournamentStore = require("../stores/TournamentStore.react");
var LocationStore = require("../stores/LocationStore.react");

var TournamentActionCreators = require("../actions/TournamentActionCreators.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var LocationActionCreators = require("../actions/LocationActionCreators.react");


var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var _ = require("underscore");
var HostPage = React.createClass({

  displayName: "Host Registration Page",

  getInitialState: function() {
    return {
      errors: [],
      messages: [],
      tournaments: []
    };
  },

  //componentWillReceiveProps: function(nextProps) {
  //  this.setState({
  //    errors: []
  //  });
  //},

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
      errors: TournamentStore.getErrors().
              concat(PlayerStore.getErrors(),LocationStore.getErrors()),
      tournaments: TournamentStore.getUnplayedTournamentsBySeason(this.props.currentSeason) || [],
    });
  },

  saveHost: function(e) {
    e.preventDefault();
    // TODO: validate form data, update error state
    var player = PlayerStore.getFromUser(this.props.username);
    if (!player || !player.active) {
      this.setState({errors: ["Ukjent eller inaktiv spiller"]});
      return;
    }
    var location = LocationStore.getFromHost(player.uuid);
    if (!location) {
      this.setState({errors: ["Ingen eller inaktiv lokasjon for gjeldende spiller"]});
      return;
    }

    var tournamentID = this.refs.selectedTournament.getValue();
    TournamentActionCreators.setHost(tournamentID, location.uuid);
    this.setState({messages: ["Vertskap registrert -- husk å registere evt andre turneringer samme kveld"]});
  },

  changeTournament: function(e) {
    //e.preventDefault();
    this.setState({errors: [], messages: []});
  },

  render: function() {
    var errors = this.state.errors.map(function(item, i) {
      return (
          <div className="alert alert-danger" key={"alert-" + i}>
            {item}
          </div>
      );
    });

    var messages = this.state.messages.map(function(item, i) {
      return (
        <div className="alert alert-info" key={"alert-" + i}>
          {item}
        </div>
      );
    });

    return (
      <div id="page-wrapper">
        <div className="row">
          <p></p>
          {errors}
          {messages}
          <div className="col-lg-12">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h4>Velg turnering</h4>
              </div>
              <div className="panel-body">
                <form>
                  <Input label="Tidspunkt" onChange={this.changeTournament} placeholder="Velg turnering" ref="selectedTournament" type="select">
                  {this.state.tournaments.map(function(item, i) {
                    return (
                      <option key={"tnr-option-" + i} value={item.uuid}>{moment(item.info.scheduled).format("DD.MM.YY HH:mm")}</option>
                    );
                  })}
                  </Input>
                  <Button onClick={this.saveHost} bsStyle="primary">Registrer vertskap</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>      
    );
  }
});

module.exports = HostPage;
