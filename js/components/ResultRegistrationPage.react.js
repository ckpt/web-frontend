var React = require("react");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var PlayerStore = require("../stores/PlayerStore.react");
var TournamentStore = require("../stores/TournamentStore.react");

var TournamentActionCreators = require("../actions/TournamentActionCreators.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");

var Authentication = require("../utils/Authentication");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var _ = require("underscore");
var ResultRegistrationPage = React.createClass({

  displayName: "Result Registration Page",
  mixins: [ Authentication ],
  
  getInitialState: function() {
    return {
      errors: [],
      messages: [],
      players: [],
      tournaments: [],
      results: [],
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
    PlayerActionCreators.loadPlayers();
    TournamentActionCreators.loadTournaments();
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
    TournamentStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      errors: TournamentStore.getErrors().concat(PlayerStore.getErrors()),
      players: PlayerStore.getPlayers() || [],
      tournaments: TournamentStore.getUnplayedTournamentsBySeason(this.props.currentSeason) || [],
    });
  },

  saveResults: function(e) {
    e.preventDefault();
    // TODO: validate form data, update error state

    if (this.state.results.length < 5) {
      this.setState({errors: ["Færre enn 5 spillere registrert. Ugyldig runde."]});
      return;
    }
    var tournamentID = this.refs.selectedTournament.getValue();
    TournamentActionCreators.saveResults(tournamentID, this.state.results);
    this.setState({messages: ["Resultat registrert"]});
  },

  changeTournament: function(e) {
    //e.preventDefault();
    var tournament = TournamentStore.getFromUUID(this.refs.selectedTournament.getValue());
    var results = tournament ? tournament.result : [];
    this.refs.resultForm.getDOMNode().reset();
    this.setState({results: results, errors: [], messages: []});
  },

  playerSelect: function(e) {
    this.setState({results:[]});
    var newres = [];
    for (var i=0; i<this.state.players.length; i++) {
      var playerID = this.refs["rank-" + i].getValue();
      if (playerID) {
        newres.push(playerID);
      }
    }
    console.log("After selection results are:");
    console.log(newres);
    this.setState({results:newres});
  },

  _createPlayerlist: function(key) {
    var that = this;
    var playerlist = this.state.players.map(function(item, j) {
      // filter out players already entered
      if (_.contains(that.state.results, item.uuid) &&
        that.state.results[key] != item.uuid) {
          return;
      }
      // filter out inactive/retired players
      // TODO: make checkbox option to show these
      if (!item.active) {
        return;
      }
      
      return (
        <option key={"place-" + key + "-player-" + j} value={item.uuid}>{item.nick}</option>
      );
    });

    return playerlist;
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

    var that = this;
    var playerinput = this.state.players.map(function(item, i) {
      var list = that._createPlayerlist(i);
      return (
        <Input onChange={that.playerSelect} label={i+1 + ". plass"} placeholder="Velg spiller" ref={"rank-" + i} type="select" key={"place-" + i}>
        <option key={"place-" + i + "-player-default"} value={null}></option>
        {list}
        </Input>
      );
    });

    return (
      <div id="page-wrapper">
        <div className="row">
          <p></p>
          {errors}
          {messages}
          <div className="col-lg-3">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h4>Velg turnering</h4>
              </div>
              <div className="panel-body">
                <form>
                  <Input label="Opprinnelig tidspunkt" onChange={this.changeTournament} placeholder="Velg turnering" ref="selectedTournament" type="select">
                  {this.state.tournaments.map(function(item, i) {
                    return (
                      <option key={"tnr-option-" + i} value={item.uuid}>{moment(item.info.scheduled).format("DD.MM.YY HH:mm")}</option>
                    );
                  })}
                  </Input>
                  <Button onClick={this.saveResults} bsStyle="primary">Lagre resultat</Button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h4>Resultater</h4>
              </div>
              <div className="panel-body">
                <form ref="resultForm">
                    {playerinput}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>      
    );
  }
});

module.exports = ResultRegistrationPage;
