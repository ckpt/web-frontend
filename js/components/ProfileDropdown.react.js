"use strict";

var React = require("react");
var Link = require("react-router-dom").Link;

var ProfileModal = require("./ProfileModal.react");
var SettingsModal = require("./SettingsModal.react");

var ProfileDropdown = React.createClass({

  displayName: "Topbar user profile dropdown",

  getInitialState: function() {
    return {
      pmShow: false,
      smShow: false
    };
  },

  pmClose: function(e) {
    this.setState({pmShow: false});
  },

  pmOpen: function(e) {
    this.setState({pmShow: true});
  },

  smClose: function(e) {
    this.setState({smShow: false});
  },

  smOpen: function(e) {
    this.setState({smShow: true});
  },

  render: function() {
    return (
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">
              <i className="fa fa-user fa-fw"></i> {this.props.player ? this.props.player.nick : "Ukjent"} <i className="fa fa-caret-down"></i>
            </a>
            <ul className="dropdown-menu dropdown-user">
              { /* <li><a href="#"><i className="fa fa-bookmark fa-fw"></i> Min side</a>
              </li> */ }
              <li><a href={"#" + this.props.currentPath} onClick={this.pmOpen}><i className="fa fa-user fa-fw"></i> Profil</a>
              </li>
              <li><a href={"#" + this.props.currentPath} onClick={this.smOpen}><i className="fa fa-gear fa-fw"></i> Innstillinger</a>
              </li>
              <li className="divider"></li>
              <li><Link to="logout"><i className="fa fa-sign-out fa-fw"></i> Logg ut</Link>
              </li>
            </ul>
            <ProfileModal player={this.props.player} show={this.state.pmShow} onHide={this.pmClose} />
            <SettingsModal player={this.props.player} username={this.props.username} show={this.state.smShow} onHide={this.smClose} />
          </li>
      );
    }
  });

module.exports = ProfileDropdown;
