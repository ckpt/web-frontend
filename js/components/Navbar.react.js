"use strict";

var React = require("react");
var Link = require("react-router").Link;
var Authentication = require("../utils/Authentication");
var PlayerStore = require("../stores/PlayerStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");

var Navbar = React.createClass({

  displayName: "Navigation and sidebar",
  mixins: [Authentication],

  getInitialState: function() {
    return {
      myNick: null
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
    this.setState({
      myNick: this._getNickFromUser()
    });
  },

  _getNickFromUser: function() {
    var player = PlayerStore.getFromUser(this.props.username);
    if (player) {
      return player.nick;
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
          <a className="navbar-brand" href="index.html">Casino Kopperud Poker Tour</a>
        </div>

        <ul className="nav navbar-top-links navbar-right">
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">
              <i className="fa fa-bell fa-fw"></i> <i className="fa fa-caret-down"></i>
            </a>
            <ul className="dropdown-menu dropdown-alerts">
              <li>
                <a href="#">
                  <div>
                    <i className="fa fa-bar-chart-o fa-fw"></i> Analyse publisert!
                    <span className="pull-right text-muted small">4 minutter siden</span>
                  </div>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a href="#">
                  <div>
                    <i className="fa fa-suitcase fa-fw"></i> Fravær registrert
                    <span className="pull-right text-muted small">12 minutter siden</span>
                  </div>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a className="text-center" href="#">
                  <strong>Se alle beskjeder</strong>
                  <i className="fa fa-angle-right"></i>
                </a>
              </li>
            </ul>
          </li>

          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">
              <i className="fa fa-user fa-fw"></i> {this.state.myNick} <i className="fa fa-caret-down"></i>
            </a>
            <ul className="dropdown-menu dropdown-user">
              <li><a href="#"><i className="fa fa-bookmark fa-fw"></i> Min side</a>
              </li>
              <li><a href="#"><i className="fa fa-user fa-fw"></i> Profil</a>
              </li>
              <li><a href="#"><i className="fa fa-gear fa-fw"></i> Innstillinger</a>
              </li>
              <li className="divider"></li>
              <li><Link to="logout"><i className="fa fa-sign-out fa-fw"></i> Logg ut</Link>
              </li>
            </ul>

          </li>

        </ul>

        <div className="navbar-default sidebar" role="navigation">
          <div className="sidebar-nav navbar-collapse">
            <ul className="nav" id="side-menu">
              <li>
                <a href="index.html"><i className="fa fa-dashboard fa-fw"></i> Oversikt</a>
              </li>
              <li>
                <a href="#"><i className="fa fa-lightbulb-o fa-fw"></i> Praktisk<span className="fa arrow"></span></a>
                <ul className="nav nav-second-level">
                  <li>
                    <a href="#/foo.html">Second Level Item</a>
                  </li>
                  <li>
                    <a href="bar.html">Second Level Item</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#"><i className="fa fa-users fa-fw"></i> Spillerne<span className="fa arrow"></span></a>
                <ul className="nav nav-second-level">
                  <li>
                    <a href="flot.html">Flot Charts</a>
                  </li>
                  <li>
                    <a href="morris.html">Morris.js Charts</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#"><i className="fa fa-calendar fa-fw"></i> Turneringene<span className="fa arrow"></span></a>
                <ul className="nav nav-second-level">
                  <li>
                    <a href="blank.html">Blank Page</a>
                  </li>
                  <li>
                    <a href="login.html">Login Page</a>
                  </li>
                </ul>
              </li>

              <li>
                <a href="tables.html"><i className="fa fa-trophy fa-fw"></i> Resultater</a>
              </li>
              <li>
                <a href="forms.html"><i className="fa fa-edit fa-fw"></i> Nyheter og bidrag</a>
              </li>
              <li>
                <a href="#"><i className="fa fa-beer fa-fw"></i> Kulturelt<span className="fa arrow"></span></a>
                <ul className="nav nav-second-level">
                  <li>
                    <a href="panels-wells.html">Panels and Wells</a>
                  </li>
                  <li>
                    <a href="buttons.html">Buttons</a>
                  </li>
                  <li>
                    <a href="notifications.html">Notifications</a>
                  </li>
                  <li>
                    <a href="typography.html">Typography</a>
                  </li>
                  <li>
                    <a href="icons.html"> Icons</a>
                  </li>
                  <li>
                    <a href="grid.html">Grid</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Navbar;
