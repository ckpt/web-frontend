"use strict";

var React = require("react");
var Router = require("react-router");
var Link = require("react-router").Link;

var PlayerStore = require("../stores/PlayerStore.react");
var NewsStore = require("../stores/NewsStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var NewsActionCreators = require("../actions/NewsActionCreators.react");
var Authentication = require("../utils/Authentication");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);
var _ = require("underscore");

var NewsItemPage = React.createClass({

  displayName: "News Page",
  mixins: [ Authentication, Router.State ],

  getInitialState: function() {
    return {
      newsitem: {
        title: "",
        leadin: "",
        body: "",
        created: moment(),
        author: ""
      },
      errors: []
    };
  },

  componentDidMount: function() {
    PlayerStore.addChangeListener(this._onChange);
    NewsStore.addChangeListener(this._onChange);
    PlayerActionCreators.loadPlayers();
    NewsActionCreators.loadNewsItems();
  },

  componentWillUnmount: function() {
    PlayerStore.removeChangeListener(this._onChange);
    NewsStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    var id = this.getParams().newsId
    this.setState({
      newsitem: NewsStore.getByUUID(id),
      errors: [
        PlayerStore.getErrors() +
        NewsStore.getErrors()
      ]
    });
  },

  render: function() {
    var tagTitle = {
      0: "nyheter",
      1: "analyser",
      2: "strategiavsløringer",
      3: "mattips"
    };
    
    var nick = "Ukjent";
    var p = PlayerStore.getFromUUID(this.state.newsitem.author);
    if (p && p.nick) {
      nick = p.nick;
    }

    
    return (
      <div id="page-wrapper">
        <div className="row">
        <p></p>
          <div className="panel panel-info">
            <div className="panel-heading">
              Skrevet av {nick} -- {moment(this.state.newsitem.created).fromNow()}
            </div>
            <div className="panel-body">
              <h2><strong>{this.state.newsitem.title}</strong></h2>
              <p className="lead">{this.state.newsitem.leadin}</p>
              {this.state.newsitem.body.split('\\n').map(function(p, i) {
                  return (
                  <p key={"para-" + i}>{p}</p>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = NewsItemPage;
