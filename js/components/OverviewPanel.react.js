var React = require("react");

var OverviewPanel = React.createClass({

  displayName: "OverviewPanel",
  propTypes: {
    item: React.PropTypes.object
  },

  render: function() {
    return (
      <div className={"panel panel-" + this.props.item.color}>
        <div className="panel-heading">
          <div className="row">
            <div className="col-xs-3">
              <i className={"fa fa-" + this.props.item.icon + " fa-5x"}></i>
            </div>
            <div className="col-xs-9 text-right">
              <div className="huge">{this.props.item.maintext}</div>
              <div>{this.props.item.subtext}</div>
            </div>
          </div>
        </div>
        <a href={this.props.item.link.target}>
          <div className="panel-footer">
            <span className="pull-left">{this.props.item.link.text}</span>
            <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
            <div className="clearfix"></div>
          </div>
        </a>
      </div>
    );
  }
});

module.exports = OverviewPanel;
