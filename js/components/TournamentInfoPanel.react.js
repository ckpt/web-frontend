var React = require("react");

var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var TournamentInfoPanel = React.createClass({

  displayName: "Tournament info panel",
  propTypes: {
    tournament: React.PropTypes.object,
    locationName: React.PropTypes.string,
    cateringNick: React.PropTypes.string,
  },

  render: function() {

    var tournament = this.props.tournament;
    var color = tournament.played ? "default" : "info";
    var month = moment(tournament.info.scheduled).format("MMMM");
    var time = moment(tournament.info.scheduled).format("DD.MM HH:mm");
    
    return (
      <div className="col-lg-3 col-sm-6">
        <div className={"panel panel-" + color}>
          <div className="panel-heading">
            <i className="fa fa-calendar"></i> <strong>{month}</strong>
          </div>
          <div className="panel-body">
              <dl className="dl">
                <dt>Tidspunkt <i className="fa fa-clock-o fa-fw"></i></dt>
                <dd>{time}</dd>
                <dt>Vertskap <i className="fa fa-home fa-fw"></i></dt>
                <dd>{this.props.locationName}</dd>
                <dt>Innsats <i className="fa fa-money fa-fw"></i></dt>
                <dd>{tournament.info.stake}</dd>
                <dt>Matansvar <i className="fa fa-shopping-cart fa-fw"></i></dt>
                <dd>{this.props.cateringNick}</dd>
              </dl>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TournamentInfoPanel;
