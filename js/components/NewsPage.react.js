"use strict";

var React = require("react");
var Router = require("react-router");
var Link = require("react-router").Link;

var ListGroup = require("react-bootstrap").ListGroup;
var ListGroupItem = require("react-bootstrap").ListGroupItem;
var Button = require("react-bootstrap").Button;

var NewsEditModal = require("./NewsEditModal.react");

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var PlayerStore = require("../stores/PlayerStore.react");
var NewsStore = require("../stores/NewsStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var NewsActionCreators = require("../actions/NewsActionCreators.react");
var Authentication = require("../utils/Authentication");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);
var _ = require("underscore");

var NewsPage = React.createClass({

  displayName: "News Page",
  mixins: [ Authentication, Router.State ],

  getInitialState: function() {
    return {
      newsitems: NewsStore.getNewsItems(),
      emShow: false,
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

    var reloadNeeded = !NewsStore.isValid("news");
    setTimeout(function() {
      if (!CKPTDispatcher.isDispatching() && reloadNeeded) {
        NewsActionCreators.loadNewsItems();
      }
    }, 5);

    this.setState({
      newsitems: NewsStore.getNewsItems(),
      errors: [
        PlayerStore.getErrors() +
        NewsStore.getErrors()
      ]
    });
  },

  emOpen: function(e) {
    this.setState({emShow: true});
  },

  emClose: function(e) {
    this.setState({emShow: false});
  },


  render: function() {
    var tagTitle = {
      0: "nyheter",
      1: "analyser",
      2: "strategiavsløringer",
      3: "mattips"
    };
    
    var q = this.getQuery();
    var tag = q ? q.tag : null;
    var items = this.state.newsitems || [];
    var title = "Alle bidrag og nyheter";
    
    if (tag) {
      tag = parseInt(tag);
      title = "Alle " + tagTitle[tag];
      items = _.where(items, {tag: tag}) || [];
    }

    items = _.sortBy(items, 'created').reverse();

    return (
      <div id="page-wrapper">
        <div className="row">
          <p></p>
          <div className="col-lg-12">
          <div className="pull-left">
          <h2 style={{paddingTop: "0.5em"}}>{title}</h2>
          </div>
          <div className="pull-right">
          <Button bsStyle="primary" onClick={this.emOpen}>Opprett sak</Button>
          </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
          <ListGroup>
          {items.map(function(newsitem, i) {
            var nick = "Ukjent";
            var p = PlayerStore.getFromUUID(newsitem.author);
            if (p && p.nick) {
              nick = p.nick;
            }
            return (
              <ListGroupItem key={"lg-" + i} bsSize="medium" header={newsitem.title} href={"#/news/" + newsitem.uuid}>
                Opprettet av {nick}&nbsp;{moment(newsitem.created).fromNow()}
              </ListGroupItem>
            );
          })}
          </ListGroup>
          </div>
        </div>
        <NewsEditModal tag={tag} show={this.state.emShow} onHide={this.emClose} />
      </div>
    );
  }
});

module.exports = NewsPage;
