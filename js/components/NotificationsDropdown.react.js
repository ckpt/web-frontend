"use strict";

var React = require("react");
var Link = require("react-router").Link;
var _ = require("underscore");

var NotificationsDropdown = React.createClass({

  displayName: "Topbar notifications dropdown",

  render: function() {
    return (
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
    );
  }
});

module.exports = NotificationsDropdown;
