"use strict";

var React = require("react");
var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

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
    var inverted = (this.props.order % 2 === 0) ? false : true;

    var tagToIcon = {
      0: "pencil",
      1: "graduation-cap"
    };
    var tagToClass = {
      0: "info",
      1: "info"
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
            <h4 className="timeline-title">{this.props.item.title}</h4>
            <p>
              {authorLine}
              <small className="text-muted"><i className="fa fa-clock-o"></i> {tsString}</small>
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
