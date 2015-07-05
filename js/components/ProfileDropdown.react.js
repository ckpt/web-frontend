"use strict";

var React = require("react");
var Link = require("react-router").Link;

var ProfileDropdown = React.createClass({

  displayName: "Topbar user profile dropdown",

  render: function() {
    return (
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown" href="#">
              <i className="fa fa-user fa-fw"></i> {this.props.name} <i className="fa fa-caret-down"></i>
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
      );
    }
  });

module.exports = ProfileDropdown;
