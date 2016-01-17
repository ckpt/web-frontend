var React = require("react");
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

//var DebtList = require("./DebtList.react");

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var PlayerStore = require("../stores/PlayerStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var Authentication = require("../utils/Authentication");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var _ = require("underscore");
var GossipPage = React.createClass({

  displayName: "Gossip Page",
  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      errors: [],
      messages: [],
      players: [],
      player: {uuid: null},
      gossip: {},
      votes: {winner: null, loser: null},
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

    var reloadNeeded = !PlayerStore.isValid("players");
    setTimeout(function() {
      if (!CKPTDispatcher.isDispatching() && reloadNeeded) {
        PlayerActionCreators.loadPlayers();
      }
    }, 5);

    var players = PlayerStore.getPlayers() || [];
    var player = PlayerStore.getFromUser(this.props.username) || {uuid: null};
    var gossip = {};
    var votes = {winner: null, loser: null};
    if (player && player.uuid) {
      gossip = player.gossip;
      votes = player.votes;
    }

    this.setState({
      errors: PlayerStore.getErrors(),
      players: players,
      player: player,
      gossip: gossip,
      votes: votes,
    });
  },

  setVotes: function(e) {
    e.preventDefault();
    var player = PlayerStore.getFromUser(this.props.username);
    if (!player || !player.active) {
      this.setState({errors: ["Ukjent eller inaktiv spiller"]});
      return;
    }
    PlayerActionCreators.setVotes(player.uuid, this.state.votes);
    this.setState({messages: ["Tips oppdatert"]});
  },


  setGossip: function(e) {
    e.preventDefault();
    // TODO: validate form data, update error state
    var player = PlayerStore.getFromUser(this.props.username);
    if (!player || !player.active) {
      this.setState({errors: ["Ukjent eller inaktiv spiller"]});
      return;
    }

    var self = this;
    var newGossip = {};
    this.state.players.map(function(item, i) {
      var ref = "gossip-text-" + item.uuid;
      if (_.has(self.refs, ref)) {
        newGossip[item.uuid] = self.refs[ref].getValue();
      }
    });
    PlayerActionCreators.setGossip(player.uuid, newGossip);
    this.setState({messages: ["Sladder oppdatert"]});
  },

  handleChange: function() {
    this.setState({votes: {
      winner: this.refs.winner.getValue(),
      loser: this.refs.loser.getValue()
      }
    });
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
          <div className="col-lg-3">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h4>Sesongtips</h4>
              </div>
              <div className="panel-body">
                <form>
                  <Input type="select" label="Favoritt til å vinne" ref="winner" placeholder="Velg spiller" onChange={this.handleChange} value={this.state.votes.winner}>
                    <option key="winner-default" value="00000000-0000-0000-0000-000000000000"></option>
                    { _.reject(this.state.players, function(p) {
                      return (!p.active);
                    }).map(function(item, i) {
                      return (
                        <option key={"winner-" + i} value={item.uuid}>{item.nick}</option>
                      );
                    })}
                  </Input>

                  <Input type="select" label="Favoritt til å tape" ref="loser" placeholder="Velg spiller" onChange={this.handleChange} value={this.state.votes.loser}>
                    <option key="loser-default" value="00000000-0000-0000-0000-000000000000"></option>
                    { _.reject(this.state.players, function(p) {
                      return (!p.active);
                    }).map(function(item, i) {
                      return (
                        <option key={"loser-" + i} value={item.uuid}>{item.nick}</option>
                      );
                    })}
                  </Input>
                  <Button onClick={this.setVotes} bsStyle="primary">Oppdater tips</Button>
                </form>

              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h4>Sladder</h4>
              </div>
              <div className="panel-body">
                <form>
                  { _.reject(this.state.players, function(p) {
                    return (p.uuid === player.uuid || !p.active);
                  }).map(function(item, i) {
                    var gossip = self.state.gossip;
                    var currentPlayerGossip = _.has(gossip, item.uuid) ? gossip[item.uuid] : null
                    return (
                      <Input key={"gossip-text-" + i} type='text' label={item.nick} defaultValue={currentPlayerGossip} placeholder="Sladre her.." ref={"gossip-text-" + item.uuid} />
                    );
                  })}
                  <Button onClick={this.setGossip} bsStyle="primary">Oppdater sladder</Button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
});

module.exports = GossipPage;
