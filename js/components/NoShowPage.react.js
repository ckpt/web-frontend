var React = require("react");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var PlayerStore = require("../stores/PlayerStore.react");
var TournamentStore = require("../stores/TournamentStore.react");

var TournamentActionCreators = require("../actions/TournamentActionCreators.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");

var NoShowList = require("./NoShowList.react");
var Authentication = require("../utils/Authentication");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var _ = require("underscore");
var NoShowPage = React.createClass({

  displayName: "Absentee Registration Page",
  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      errors: [],
      messages: [],
      tournaments: [],
      candidates: [],
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
    var player = PlayerStore.getFromUser(this.props.username) || null;
    var candidates = TournamentStore.getUnplayedTournamentsBySeason(this.props.currentSeason) || [];
    var registered = [];
    if (player && player.uuid) {
      registered = TournamentStore.getByAbsentee(player.uuid) || [];
    }
    var tournaments = _.difference(candidates, registered);
    this.setState({
      errors: TournamentStore.getErrors().
              concat(PlayerStore.getErrors()),
      tournaments: tournaments,
      candidates: candidates,
    });
  },

  saveNoShow: function(e) {
    e.preventDefault();
    // TODO: validate form data, update error state
    var player = PlayerStore.getFromUser(this.props.username);
    if (!player || !player.active) {
      this.setState({errors: ["Ukjent eller inaktiv spiller"]});
      return;
    }

    var tournamentID = this.refs.selectedTournament.getValue();
    var reason = this.refs.reason.getValue();
    TournamentActionCreators.addNoShow(tournamentID, player.uuid, reason);
    this.setState({messages: ["Fravær registrert -- husk å registere evt andre turneringer samme kveld"]});
    TournamentActionCreators.loadTournaments();
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
          <div className="col-lg-6">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h4>Registrert fravær</h4>
              </div>
              <div className="panel-body">
                <NoShowList tournaments={this.state.candidates}/>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
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
                  <Input type='text' ref="reason" label="Grunn:" placeholder="Oppgi fraværsgrunn" />
                  <Button onClick={this.saveNoShow} bsStyle="primary">Registrer fravær</Button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
});

module.exports = NoShowPage;
