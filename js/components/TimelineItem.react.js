"use strict";

var React = require("react");
var moment = require("moment");
var Link = require("react-router").Link;
require("moment/locale/nb.js");
moment.locale("nb");

var TimelineItem = React.createClass({

  displayName: "Timeline item",
  propTypes: {
    item: React.PropTypes.object,
    order: React.PropTypes.number
  },

  render: function() {
    var authorLine;
    if (this.props.item.author) {
      authorLine = (
        <small className="text-muted">
          <i className="fa fa-user"></i> {this.props.item.authorNick}&nbsp;&nbsp;
        </small>
      );
    }
    var tsString = moment(this.props.item.created).fromNow();
    var comments = this.props.item.comments ? this.props.item.comments.length : 0;
    var inverted = (this.props.order % 2 === 0) ? false : true;

    var tagToIcon = {
      0: "pencil",
      1: "graduation-cap",
      2: "bomb",
      3: "cutlery"
    };
    var tagToClass = {
      0: "info",
      1: "success",
      2: "warning",
      3: "primary"
    };
    var icon = tagToIcon[this.props.item.tag];
    var color = tagToClass[this.props.item.tag];

    return (
      <li className={inverted ? "timeline-inverted" : ""}>
        <div className={"timeline-badge " + color}>
          <i className={"fa fa-" + icon}></i>
        </div>
        <div className="timeline-panel">
          <div className="timeline-heading">
            <h4 className="timeline-title">
              <Link to={"/news/" + this.props.item.uuid}>{this.props.item.title}</Link>
            </h4>
            <p>
              {authorLine}
              <small className="text-muted"><i className="fa fa-clock-o"></i> {tsString}</small>&nbsp;
              <small className="text-muted"><i className="fa fa-comments-o"></i> {comments}</small>
            </p>
          </div>
          <div className="timeline-body">
            {this.props.item.leadin.split('\\n').map(function(p, i) {
              return (
              <p key={"para-" + i}>{p}</p>
              );
            })}
          </div>
        </div>
      </li>
    );
  }
});

module.exports = TimelineItem;
