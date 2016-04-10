var React = require("react");

var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var SeasonAwardsPanel = React.createClass({

  displayName: "Season awards panel",
  propTypes: {
    awards: React.PropTypes.object,
    season: React.PropTypes.number
  },

  render: function() {

    return (
      <div className="col-lg-6">
        <div className="panel panel-default">
          <div className="panel-heading">
            <i className="fa fa-calendar"></i> <strong>Sesongen {this.props.season}</strong>
          </div>
          <div className="panel-body">
            <div className="pull-left text-center text-warning">
              <i className="fa fa-trophy fa-4x"></i><h2>{this.props.awards.champion.nick}</h2>
              <h4><i className="fa fa-money"></i> {this.props.awards.champion.winnings}</h4>
            </div>
            <div className="pull-right text-info">
              <dl className="dl-horizontal">
                <dt>Plassiffer <i className="fa fa-bar-chart-o fa-fw"></i></dt>
                <dd>{this.props.awards.avgPlaceWinner.nick} ({this.props.awards.avgPlaceWinner.avgPlace.toFixed(2)})</dd>
                <dt>Lavpoeng <i className="fa fa-graduation-cap fa-fw"></i></dt>
                <dd>{this.props.awards.pointsWinner.nick} ({this.props.awards.pointsWinner.points})</dd>
                <dt>Gultrøyegrossisten <i className="fa fa-bullseye fa-fw"></i></dt>
                <dd>{this.props.awards.mostYellowDays.nick} ({this.props.awards.mostYellowDays.days} dager)</dd>
                <dt>Årets spiller <i className="fa fa-plus-circle fa-fw"></i></dt>
                <dd>{this.props.awards.playerOfTheYear.nick} ({this.props.awards.playerOfTheYear.months} mnd)</dd>
                <dt>Årets krill <i className="fa fa-minus-circle fa-fw"></i></dt>
                <dd>{this.props.awards.loserOfTheYear.nick} ({this.props.awards.loserOfTheYear.months} mnd)</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SeasonAwardsPanel;
