var React = require("react");

var LocationPanel = React.createClass({

  displayName: "Location panel",
  propTypes: {
    location: React.PropTypes.object
  },

  render: function() {

    return (
      <div className="col-lg-6">
        <div className={"panel panel-info"}>
          <div className="panel-heading">
            <i className="fa fa-home"></i> {this.props.location.profile.name}
          </div>
          <div className="panel-body">
            <img className="pull-right" height="200px" src={"data:image/png;base64," + this.props.location.pictures[0]} />
            {this.props.location.profile.description}
          </div>
          <div className="panel-footer">
            <dl className="dl-horizontal">
              <dt>Fasiliteter <i className="fa fa-info-circle"></i></dt>
              <dd>{this.props.location.profile.facilities.join(", ")}</dd>
              <dt>Beliggenhet <i className="fa fa-map-marker"></i></dt>
              <dd><a href={this.props.location.profile.url}>Se i kart</a></dd>
            </dl>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LocationPanel;
