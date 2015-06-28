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
          <i className="fa fa-user"></i>
          {this.props.item.author}&nbsp;
        </small>
      );
    }
    var tsString = this.props.item.createdAt.fromNow();
    var inverted = (this.props.order % 2 === 0) ? false : true;

    return (
      <li className={inverted ? "timeline-inverted" : ""}>
        <div className={"timeline-badge " + this.props.item.color}>
          <i className={"fa fa-" + this.props.item.icon}></i>
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
            <p>{this.props.item.content}</p>
          </div>
        </div>
      </li>
    );
  }
});

module.exports = TimelineItem;
