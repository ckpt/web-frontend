"use strict";

var React = require("react");
var Link = require("react-router").Link;
var _ = require("underscore");

var SidebarItem = React.createClass({

  displayName: "Sidebar menu item",

  _makeChildren: function(items) {
    var _makeChild = function(item, i) {
      var params = _.has(item, "query") ? item.query : null;
      return (
        <li key={"sidebar-child-" + i}>
          <Link to={item.route} query={params}>{item.title}</Link>
        </li>
      );
    };

    return (
      <ul className="nav nav-second-level">
        {items.map(function (child, i) {
          return _makeChild(child, i);
         })}
      </ul>
    );
  },

  render: function() {
    var item = this.props.item;
    if (item.route) {
      var params = _.has(item, "query") ? item.query : null;
      return (
        <li>
          <Link to={item.route} query={params}><i className={"fa fa-" + item.icon + " fa-fw"}></i> {item.title}</Link>
        </li>
      );
    } else {
      var children = this._makeChildren(item.subitems);
      return (
        <li>
          <a href="#submenu">
            <i className={"fa fa-" + item.icon + " fa-fw"}></i> {item.title}<span className="fa arrow"></span>
          </a>
          {children}
        </li>
      );
    }
  }
});

module.exports = SidebarItem;
