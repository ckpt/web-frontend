"use strict";

var React = require("react");
var OverviewSection = require("./OverviewSection.react");
var TimelineSection = require("./TimelineSection.react");
var TaskStore = require("../stores/TaskStore.react");
var PlayerStore = require("../stores/PlayerStore.react");
var TaskActionCreators = require("../actions/TaskActionCreators.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var Authentication = require("../utils/Authentication");

var Dashboard = React.createClass({

  displayName: "Dashboard Page",
  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      tasks: TaskStore.numTasks(),
      currentStandings: [ { uuid: "312312-44123-31213-3213", sum: -400 } ],
      nextTournament: null,
      errors: []
    };
  },

  componentDidMount: function() {
    TaskStore.addChangeListener(this._onChange);
    PlayerStore.addChangeListener(this._onChange);
    TaskActionCreators.loadTasks();
    PlayerActionCreators.loadPlayers();
  },

  componentWillUnmount: function() {
    TaskStore.removeChangeListener(this._onChange);
    PlayerStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      tasks: TaskStore.numTasks(),
      errors: [
        TaskStore.getErrors() +
        PlayerStore.getErrors()
      ]
    });
  },

  _userWinnings: function(season) {
    var player = PlayerStore.getFromUser(this.props.username);
    if (!player) {
      return null;
    }
    var playerUUID = player.uuid;
    var playerStanding = this.state.currentStandings.filter(function(item) {
      return item.uuid === playerUUID;
    }).pop() || null;
    if (playerStanding) {
      return playerStanding.sum;
    } else {
      return null;
    }
  },

  _makeOverviewItem: function(icon, maintext, subtext, color, link) {
    return {
      icon: icon,
      maintext: maintext,
      subtext: subtext,
      color: color,
      link: link
    };
  },

  _makeOverviewItems: function() {
    var currentSeason = 2015;
    var userWinnings = this._userWinnings(currentSeason);
    var tasksItem = this._makeOverviewItem("tasks", this.state.tasks,
                                           "Uløste oppgaver!",
                                           this.state.tasks > 0 ? "info" : "success",
                                           { target: "#", text: "Se hvilke" });
    var playerItem = this._makeOverviewItem("money", userWinnings,
                                            "Gevinst i " + currentSeason,
                                            userWinnings < 0 ? "red" : "success",
                                            { target: "#", text: "Se årets resultater" });
    return [playerItem, tasksItem];
  },

  render: function() {
    var overviewItems = this._makeOverviewItems();

    return (
      <div id="page-wrapper">
        <div className="row">
          <OverviewSection items={overviewItems} />
        </div>
        <div className="row">
          <TimelineSection />
          <div className="col-lg-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <i className="fa fa-table fa-fw"></i> Tabellen
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nick</th>
                      <th>Gevinst</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="warning">
                      <td>1</td>
                      <td>Lars Vegas</td>
                      <td>1200</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Syntax Error</td>
                      <td>800</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Pæra</td>
                      <td>800</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Puta</td>
                      <td>700</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Kunden</td>
                      <td>200</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Bjøro</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>Dalton</td>
                      <td>-200</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>Panzer</td>
                      <td>-400</td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>Junior</td>
                      <td>-600</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>Senior</td>
                      <td>-600</td>
                    </tr>
                    <tr className="danger">
                      <td>11</td>
                      <td>Runator</td>
                      <td>-800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <i className="fa fa-quote-right fa-fw"></i> Pokersitater
              </div>
              <div className="panel-body">
                <blockquote>
                  <p>Blinde høns kan også finne korn!</p>
                  <h4 className="pull-right text-muted">--Panzer</h4>
                </blockquote>
              </div>
            </div>
            <div className="chat-panel panel panel-default">
              <div className="panel-heading">
                <i className="fa fa-comments fa-fw"></i>
                Chat
                <div className="btn-group pull-right">
                  <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-chevron-down"></i>
                  </button>
                  <ul className="dropdown-menu slidedown">
                    <li>
                      <a href="#">
                        <i className="fa fa-refresh fa-fw"></i> Refresh
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-check-circle fa-fw"></i> Available
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-times fa-fw"></i> Busy
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-clock-o fa-fw"></i> Away
                      </a>
                    </li>
                    <li className="divider"></li>
                    <li>
                      <a href="#">
                        <i className="fa fa-sign-out fa-fw"></i> Sign Out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="panel-body">
                <ul className="chat">
                  <li className="left clearfix">
                    <span className="chat-img pull-left">
                      <img src="http://placehold.it/50/55C1E7/fff" alt="User Avatar" className="img-circle" />
                    </span>
                    <div className="chat-body clearfix">
                      <div className="header">
                        <strong className="primary-font">Jack Sparrow</strong>
                        <small className="pull-right text-muted">
                          <i className="fa fa-clock-o fa-fw"></i> 12 mins ago
                        </small>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.
                      </p>
                    </div>
                  </li>
                  <li className="right clearfix">
                    <span className="chat-img pull-right">
                      <img src="http://placehold.it/50/FA6F57/fff" alt="User Avatar" className="img-circle" />
                    </span>
                    <div className="chat-body clearfix">
                      <div className="header">
                        <small className=" text-muted">
                          <i className="fa fa-clock-o fa-fw"></i> 13 mins ago</small>
                        <strong className="pull-right primary-font">Bhaumik Patel</strong>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.
                      </p>
                    </div>
                  </li>
                  <li className="left clearfix">
                    <span className="chat-img pull-left">
                      <img src="http://placehold.it/50/55C1E7/fff" alt="User Avatar" className="img-circle" />
                    </span>
                    <div className="chat-body clearfix">
                      <div className="header">
                        <strong className="primary-font">Jack Sparrow</strong>
                        <small className="pull-right text-muted">
                          <i className="fa fa-clock-o fa-fw"></i> 14 mins ago</small>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.
                      </p>
                    </div>
                  </li>
                  <li className="right clearfix">
                    <span className="chat-img pull-right">
                      <img src="http://placehold.it/50/FA6F57/fff" alt="User Avatar" className="img-circle" />
                    </span>
                    <div className="chat-body clearfix">
                      <div className="header">
                        <small className=" text-muted">
                          <i className="fa fa-clock-o fa-fw"></i> 15 mins ago</small>
                        <strong className="pull-right primary-font">Bhaumik Patel</strong>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="panel-footer">
                <div className="input-group">
                  <input id="btn-input" type="text" className="form-control input-sm" placeholder="Type your message here..." />
                  <span className="input-group-btn">
                    <button className="btn btn-warning btn-sm" id="btn-chat">
                      Send
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
