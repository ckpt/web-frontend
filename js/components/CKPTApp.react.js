"use strict";

var React = require("react");

var Navbar = require("./Navbar.react");
var SessionStore = require("../stores/SessionStore.react");

var CKPTApp = React.createClass({

  displayName: "CKPT App",
  getInitialState: function() {
    return this._getLoginState();
  },

  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SessionStore.removeChangeListener(this._onChange);
  },

  _getLoginState: function() {
    //console.log("Fetching login state in main component: ");
    var _state = {
      loggedIn: SessionStore.isLoggedIn(),
      user: SessionStore.getUsername(),
      isAdmin: SessionStore.isAdmin(),
      errors: SessionStore.getErrors(),
      currentSeason: new Date().getFullYear()
    };
    //console.log(_state);
    return _state;
  },

  _onChange: function() {
    this.setState(this._getLoginState());
  },

  render: function() {
    var authLayout = (
      <div id="wrapper">
        <Navbar {...this.props} isAdmin={this.state.isAdmin} username={this.state.user} currentSeason={this.state.currentSeason}/>
        {React.cloneElement(this.props.children, {isAdmin: this.state.isAdmin, username: this.state.user, currentSeason: this.state.currentSeason})}
      </div>
    );

    var unauthLayout = this.props.children;

    if (this.state.loggedIn) {
      return authLayout;
    } else {
      return unauthLayout;
    }
  }
});

module.exports = CKPTApp;
