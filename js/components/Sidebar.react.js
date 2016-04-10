"use strict";

/* eslint-env jquery */
var React = require("react");
var ReactDOM = require("react-dom");
var SidebarItem = require("./SidebarItem.react.js");

var Sidebar = React.createClass({

  displayName: "Sidebar",
  getDefaultProps: function() {
    return {
      menuitems:
      [
        {
          title: "Oversikt",
          icon: "dashboard",
          route: "dashboard",
          subitems: []
        },
        {
          title: "Praktisk",
          icon: "lightbulb-o",
          route: null,
          subitems: [
            {
              title: "Regler",
              route: "rules"
            },
            {
              title: "Avdelingene",
              route: "locations"
            }
          ]
        },
        {
          title: "Spillerne",
          icon: "users",
          route: null,
          subitems: [
            {
              title: "Oversikt",
              route: "players"
            },
            {
              title: "Sladder",
              route: "gossip"
            },
            {
              title: "Gjeld",
              route: "debt"
            }
          ]
        },
        {
          title: "Turneringene",
          icon: "calendar",
          route: null,
          subitems: [
            {
              title: "Kalender",
              route: "calendar"
            },
            {
             title: "Vertskap",
             route: "host"
            },
            {
             title: "Fravær",
             route: "noshow"
            },
            // {
            // title: "Tipping",
            //   route: "betting"
            // }
          ]
        },
        {
          title: "Resultater",
          icon: "trophy",
          route: null,
          subitems: [
            {
              title: "Tabeller og statistikk",
              route: "standings"
            },
            {
              title: "Sammenlagtoversikt",
              route: "overview"
            },
            {
              title: "Hall of fame",
              route: "awards"
            },
            // {
            //   title: "Spiller vs spiller",
            //   route: "pvp"
            // },
            {
              title: "Registrere resultat",
              route: "register",
              admin: true
            }
          ]
        },
        {
          title: "Bidrag og nyheter",
          icon: "edit",
          route: null,
          subitems: [
            {
              title: "Alle bidrag",
              route: "news"
            },
            {
              title: "Nyheter",
              route: "news",
              query: {tag: 0}
            },
            {
              title: "Analyser",
              route: "news",
              query: {tag: 1}
            },
            {
              title: "Strategiavsløringer",
              route: "news",
              query: {tag: 2}
            },
            {
              title: "Mattips",
              route: "news",
              query: {tag: 3}
            }
          ]
        },
        // {
        //   title: "Kulturelt",
        //   icon: "beer",
        //   route: null,
        //   subitems: [
        //     {
        //       title: "Michelinguide",
        //       route: "michelin"
        //     },
        //     {
        //       title: "Bilder",
        //       route: "pictures"
        //     },
        //     {
        //       title: "Musikk",
        //       route: "music"
        //     },
        //     {
        //       title: "Den gode praten",
        //       route: "dgp"
        //     }
        //   ]
        // }
      ]
    };
  },

  componentDidMount: function() {
    $(ReactDOM.findDOMNode(this.refs.sideMenu)).metisMenu();
  },

  render: function() {
    var isAdmin = this.props.isAdmin;
    return (
        <div className="navbar-default sidebar" role="navigation">
          <div className="sidebar-nav navbar-collapse">
            <ul className="nav metismenu" id="side-menu" ref="sideMenu">
              {this.props.menuitems.map(function(item, i) {
                return (
                  <SidebarItem isAdmin={isAdmin} item={item} key={"sidebaritem-" + i} />
                );
                })}
            </ul>
          </div>
        </div>
    );
  }
});

module.exports = Sidebar;
