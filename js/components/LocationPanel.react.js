var React = require("react");

var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var LocationPanel = React.createClass({

  displayName: "Location panel",
  propTypes: {
    hostNick: React.PropTypes.string,
    hosted: React.PropTypes.array,
    location: React.PropTypes.object,
    next: React.PropTypes.object
  },

  render: function() {

    var next = this.props.next ? moment(this.props.next.info.scheduled).fromNow() : "Ikke fastsatt";
    var color = this.props.location.active ? "info" : "danger";

    return (
      <div className="col-lg-6">
        <div className={"panel panel-" + color}>
          <div className="panel-heading">
            <h4 style={{fontSize: "30px"}}><i className="fa fa-home"></i> {this.props.location.profile.name}</h4>
          </div>
          <div className="panel-body">
            <img style={{marginLeft: "1em", boxShadow: "5px 5px 15px #aaaaaa"}} className="pull-right" height="200px" src={"data:image/png;base64," + this.props.location.pictures[0]} />
            {this.props.location.profile.description}
          </div>
          <div className="panel-footer">
            <dl className={"dl-horizontal text-" + color}>
              <dt>Vertskap <i className="fa fa-user fa-fw"></i></dt>
              <dd>{this.props.hostNick}</dd>
              <dt>Fasiliteter <i className="fa fa-info-circle fa-fw"></i></dt>
              <dd>{this.props.location.profile.facilities.join(", ")}</dd>
              <dt>Beliggenhet <i className="fa fa-map-marker fa-fw"></i></dt>
              <dd><a href={this.props.location.profile.url}>Se i kart</a></dd>
              <dt>Turneringer i år <i className="fa fa-list fa-fw"></i></dt>
              <dd>{this.props.hosted.length}</dd>
              <dt>Neste turnering <i className="fa fa-calendar fa-fw"></i></dt>
              <dd>{next}</dd>
            </dl>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LocationPanel;
