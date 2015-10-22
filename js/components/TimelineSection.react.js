"use strict";

var React = require("react");
var moment = require("moment");
var TimelineItem = require("./TimelineItem.react");
var TimelineSection = React.createClass({

  displayName: "Timeline section",
  propTypes: {
    heading: React.PropTypes.string,
    items: React.PropTypes.arrayOf(React.PropTypes.object),
    link: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      heading: "Heading text",
      items: [
        {
          icon: "th-list",
          title: "Nye turneringsresultater!",
          content: "Resultatene fra **mai** er lagt ut",
          created: moment().startOf("hour"),
          color: "info"
        },
        {
          icon: "th-list",
          title: "Annen nyhet!",
          content: "Og mer tekst",
          author: "Panzer",
          created: moment().startOf("hour"),
          color: "info"
        }

      ],
      link: {
        target: "#",
        text: "More.."
      }
    };
  },

  render: function () {
    return (
      <div className="col-lg-8">
        <div className="panel panel-default">
          <div className="panel-heading">
            <i className="fa fa-clock-o fa-fw"></i> {this.props.heading}
          </div>
          <div className="panel-body">
            <ul className="timeline">
              {this.props.items.map(function(item, i){
                return (
                  <TimelineItem
                  item={item} key={"timelineitem-" + i}
                  order={i}/>
                );
               })}
            </ul>
          </div>
          <a href={this.props.link.target}>
            <div className="panel-footer">
              <span className="pull-left">{this.props.link.text}</span>
              <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
              <div className="clearfix"></div>
            </div>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = TimelineSection;
