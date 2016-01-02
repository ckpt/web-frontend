"use strict";

var React = require("react");
var PlayerStore = require("../stores/PlayerStore.react");
var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);
var _ = require("underscore");

var NewsComments = React.createClass({

  displayName: "News Comments Widget",

  render: function() {

    var item = this.props.item;
    var nick = "Ukjent";
    var author = item ? item.author : null;

    var currentLoggedInPlayer = PlayerStore.getFromUser(this.props.user);
    var comments = item && item.comments ? item.comments : [];

    return (
      <div>
        {comments.map(function(comment, i) {
          var paras = comment.content.split('\\n').map(function(para, j) {
            return <p key={"comment-" + i + "-para-" + j}>{para}</p>;
          });

          var p = PlayerStore.getFromUUID(comment.player);
          if (p && p.nick) {
            nick = p.nick;
          }

          return (
            <div key={"comment-" + i} className="panel panel-default">
              <div className="panel-heading">
                {nick} kommenterte {moment(comment.created).fromNow()}
              </div>
              <div className="panel-body">
                {paras}
              </div>
           </div>
          );
        })}
      </div>
    );
  }
});

module.exports = NewsComments;
