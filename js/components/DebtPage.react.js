var React = require("react");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var DebtList = require("./DebtList.react");

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var PlayerStore = require("../stores/PlayerStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var Authentication = require("../utils/Authentication");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var _ = require("underscore");
var DebtPage = React.createClass({

  displayName: "Debt Page",
  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      errors: [],
      messages: [],
      players: [],
      player: {uuid: null},
      reloadNeeded: false,
      debts: [],
      credits: [],
    };
  },

  componentDidMount: function() {
    PlayerStore.addChangeListener(this._onChange);
    PlayerActionCreators.loadPlayers();
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {

    setTimeout(function() {
      if (!CKPTDispatcher.isDispatching() && this.state.reloadNeeded) {
        PlayerActionCreators.loadPlayers();
      }
    }, 10);

    var reloadNeeded = !PlayerStore.isValid("players");
    var players = PlayerStore.getPlayers() || [];
    var player = PlayerStore.getFromUser(this.props.username) || {uuid: null};
    var debts = [];
    var credits = [];
    if (player && player.uuid) {
      debts = player.debts;
      credits = PlayerStore.getCreditsByUUID(player.uuid) || [];
    }

    this.setState({
      errors: PlayerStore.getErrors(),
      reloadNeeded: reloadNeeded,
      players: players,
      player: player,
      debts: debts,
      credits: credits,
    });
  },

  settleDebt: function(debtuuid, debitor, e) {
    e.preventDefault();
    var player = PlayerStore.getFromUser(this.props.username);
    if (!player || !player.active) {
      this.setState({errors: ["Ukjent eller inaktiv spiller"]});
      return;
    }
    PlayerActionCreators.settleDebt(debtuuid, debitor);
    this.setState({messages: ["Gjeld innfridd"]});
  },


  addDebt: function(e) {
    e.preventDefault();
    // TODO: validate form data, update error state
    var player = PlayerStore.getFromUser(this.props.username);
    if (!player || !player.active) {
      this.setState({errors: ["Ukjent eller inaktiv spiller"]});
      return;
    }

    var amount = parseInt(this.refs.amount.getValue());
    if (!amount || amount <= 0) {
      this.setState({errors: ["Beløpet må være større enn 0"]});
      return;
    }
    var reason = this.refs.reason.getValue();
    var debitor = this.refs.debitor.getValue();
    PlayerActionCreators.addDebt(player.uuid, debitor, amount, reason);
    this.setState({messages: ["Nytt krav registrert"]});
  },

  render: function() {
    var player = this.state.player;
    var errors = this.state.errors.map(function(item, i) {
      return (
          <div className="alert alert-danger" key={"alert-" + i}>
            {item}
          </div>
      );
    });

    var self = this;
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
                <h4>Registrert gjeld</h4>
              </div>
              <div className="panel-body">
                <DebtList debts={this.state.debts} player={this.state.player} onSettle={function(){}} />
              </div>
            </div>

            <div className="panel panel-info">
              <div className="panel-heading">
                <h4>Utestående krav</h4>
              </div>
              <div className="panel-body">
                <DebtList debts={this.state.credits} listDebitors={true} player={this.state.player} onSettle={self.settleDebt} />
              </div>
            </div>

          </div>

          <div className="col-lg-6">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h4>Ny gjeld</h4>
              </div>
              <div className="panel-body">
                <form>
                  <Input label="Låntaker" placeholder="Velg spiller" ref="debitor" type="select">
                  { _.reject(this.state.players, function(p) {
                    return (p.uuid === player.uuid);
                  }).map(function(item, i) {
                    return (
                      <option key={"player-option-" + i} value={item.uuid}>{item.nick}</option>
                    );
                  })}
                  </Input>
                  <Input type='number' ref="amount" label="Beløp:" placeholder="Skriv inn beløp" />
                  <Input type='text' ref="reason" label="Gjelder:" placeholder="Beskrivelse" />
                  <Button onClick={this.addDebt} bsStyle="primary">Registrer gjeld</Button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
});

module.exports = DebtPage;
