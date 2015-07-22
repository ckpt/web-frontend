"use strict";

/* eslint-env jquery */
var React = require("react");
var SidebarItem = require("./SidebarItem.react.js");
//var Authentication = require("../utils/Authentication");
//var PlayerStore = require("../stores/PlayerStore.react");

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
            {
              title: "Tipping",
              route: "betting"
            }
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
            {
              title: "Spiller vs spiller",
              route: "pvp"
            },
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
              query: {tag: "news"}
            },
            {
              title: "Analyser",
              route: "news",
              query: {tag: "analysis"}
            },
            {
              title: "Strategiavsløringer",
              route: "news",
              query: {tag: "strategy"}
            },
            {
              title: "Mattips",
              route: "news",
              query: {tag: "recepie"}
            }
          ]
        },
        {
          title: "Kulturelt",
          icon: "beer",
          route: null,
          subitems: [
            {
              title: "Michelinguide",
              route: "michelin"
            },
            {
              title: "Bilder",
              route: "pictures"
            },
            {
              title: "Musikk",
              route: "music"
            },
            {
              title: "Den gode praten",
              route: "dgp"
            }
          ]
        }
      ]
    };
  },

  componentDidMount: function() {
    $(React.findDOMNode(this.refs.sideMenu)).metisMenu();
  },

  render: function() {
    return (
        <div className="navbar-default sidebar" role="navigation">
          <div className="sidebar-nav navbar-collapse">
            <ul className="nav metismenu" id="side-menu" ref="sideMenu">
              {this.props.menuitems.map(function(item, i) {
                return (
                  <SidebarItem item={item} key={"sidebaritem-" + i} />
                );
                })}
            </ul>
          </div>
        </div>
    );
  }
});

module.exports = Sidebar;
