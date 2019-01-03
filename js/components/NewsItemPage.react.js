"use strict";

var React = require("react");
var Button = require("react-bootstrap").Button;

var CKPTDispatcher = require("../dispatcher/CKPTDispatcher.js");
var NewsEditModal = require("./NewsEditModal.react");
var NewsCommentModal = require("./NewsCommentModal.react");
var NewsComments = require("./NewsComments.react");
var PlayerStore = require("../stores/PlayerStore.react");
var NewsStore = require("../stores/NewsStore.react");
var PlayerActionCreators = require("../actions/PlayerActionCreators.react");
var NewsActionCreators = require("../actions/NewsActionCreators.react");

var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var _ = require("underscore");

var NewsItemPage = React.createClass({

  displayName: "News Page",

  getInitialState: function() {
    return {
      newsitem: {
        title: "",
        leadin: "",
        body: "",
        created: moment(),
        comments: [],
        author: ""
      },
      emShow: false,
      acShow: false,
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

    var id = this.props.params.newsId;
    var newsItem = NewsStore.getByUUID(id);
    //if (newsItem && newsItem.comments) {
    //  newsItem.comments.reverse();
    //}
    this.setState({
      newsitem: newsItem,
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

  acOpen: function(e) {
    this.setState({acShow: true});
  },

  acClose: function(e) {
    this.setState({acShow: false});
  },

  render: function() {
    var tagTitle = {
      0: "nyheter",
      1: "analyser",
      2: "strategiavsløringer",
      3: "mattips"
    };

    var nick = "Ukjent";
    var p = this.state.newsitem ? PlayerStore.getFromUUID(this.state.newsitem.author) : null;
    if (p && p.nick) {
      nick = p.nick;
    }

    var currentLoggedInPlayer = PlayerStore.getFromUser(this.props.user);
    var editButton = "";
    var addButton = <Button bsSize="xsmall" bsStyle="primary" onClick={this.acOpen}>Ny kommentar</Button>;

    if ( (currentLoggedInPlayer && currentLoggedInPlayer.uuid == p.uuid) || this.props.isAdmin) {
      editButton = <Button bsSize="xsmall" bsStyle="primary" onClick={this.emOpen}>Rediger sak</Button>;
    }

    var created = this.state.newsitem ? moment(this.state.newsitem.created).fromNow() : ";"
    var title = this.state.newsitem ? this.state.newsitem.title : "";
    var leadin = this.state.newsitem ? this.state.newsitem.leadin : "";
    var body = this.state.newsitem ? this.state.newsitem.body : "";

    return (
      <div id="page-wrapper">
        <div className="row">
        <p></p>
          <div className="panel panel-info">
            <div className="panel-heading">
              Skrevet av {nick} -- {created}
              <span className="pull-right">{editButton}&nbsp;&nbsp;{addButton}</span>
            </div>
            <div className="panel-body">
              <h2><strong>{title}</strong></h2>
              <p className="lead">
              {leadin.split('\\n').map(function(p, i) {
                  return (
                  <span key={"para-lead-" + i}>{p}<br/></span>
                  );
                })}
              </p>
              {body.split('\\n').map(function(p, i) {
                  return (
                  <p key={"para-" + i}>{p}</p>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="row">
          <NewsComments item={this.state.newsitem} />
        </div>
        <NewsEditModal item={this.state.newsitem} show={this.state.emShow} onHide={this.emClose} />
        <NewsCommentModal item={this.state.newsitem} show={this.state.acShow} onHide={this.acClose} />
      </div>
    );
  }
});

module.exports = NewsItemPage;
