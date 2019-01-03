"use strict";

var React = require("react");

var Sidebar = require("./Sidebar.react.js");
var NotificationsDropdown = require("./NotificationsDropdown.react.js");
var ProfileDropdown = require("./ProfileDropdown.react.js");

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var PlayerStore = require("../stores/PlayerStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");

var Navbar = React.createClass({

  displayName: "Navigation and sidebar",

  getInitialState: function() {
    return {
      myPlayer: null
    };
  },

  componentDidMount: function() {
    PlayerStore.addChangeListener(this._onChange);
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

    this.setState({
      myPlayer: this._getPlayerFromUser()
    });
  },

  _getPlayerFromUser: function() {
    var player = PlayerStore.getFromUser(this.props.username);
    if (player) {
      return player;
    }
    return null;
  },

  render: function() {
    return (

      <nav className="navbar navbar-default navbar-static-top" role="navigation" style={{marginBottom: 0}}>
        <div className="navbar-header">
          <button className="navbar-toggle" data-target=".navbar-collapse" data-toggle="collapse" type="button">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <div className="navbar-brand">
            <a href="index.html"><img style={{marginTop: -10, marginLeft: -5}} height="40px" src="images/ckpt-trans.png" /> CKPT {this.props.currentSeason}</a>
          </div>
        </div>

        <ul className="nav navbar-top-links navbar-right">
          { /* <NotificationsDropdown /> */ }
          <ProfileDropdown currentPath={this.props.currentPath} player={this.state.myPlayer} username={this.props.username}/>
        </ul>

        <Sidebar isAdmin={this.props.isAdmin}/>
      </nav>
    );
  }
});

module.exports = Navbar;
