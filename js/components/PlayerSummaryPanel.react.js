var React = require("react");

var moment = require("moment");
require("moment/locale/nb.js");
moment.locale("nb");

var PlayerSummaryPanel = React.createClass({

  displayName: "Player summary panel",
  propTypes: {
    player: React.PropTypes.object
  },

  render: function() {

    //console.log(this.props.winnings);
    var winnings = this.props.winnings ? this.props.winnings.winnings : "";
    var numPlayed = this.props.winnings ? this.props.winnings.played : "";
    var numWins = this.props.winnings ? this.props.winnings.wins : "";
    var numSeconds = this.props.winnings ? (this.props.winnings.headsUp - this.props.winnings.wins) : "";

    var color = this.props.player.active ?
                (winnings < 0 ? "danger" : "success") : "default";
    var img = this.props.player.profile.picture ? <img style={{marginRight: "1em", boxShadow: "5px 5px 15px #aaaaaa"}} className="pull-left" height="120px" src={"data:image/png;base64," + this.props.player.profile.picture} /> : "";

    var nick = this.props.player.nick;
    var xtra = this.props.xtraicons.map(function (icon, i) {
      return (<i key={"badge-" + i} title={icon.desc} className={"fa fa-" + icon.icon}></i> );
    });

    return (
      <div className="col-lg-4">
        <div className={"panel panel-" + color}>
          <div className="panel-heading">
            <h4>{nick} {xtra} <small> -- {this.props.player.profile.name} </small></h4>
          </div>
          <div className="panel-body">
            {img}
            {this.props.player.profile.description}
          </div>
          <div className={"panel-footer text-" + color}>
            {this.props.footer}&nbsp;&nbsp;&nbsp;
              <i className="fa fa-money" title="Gevinst"></i> {winnings} &nbsp;<i title="Antall turneringer" className="fa fa-calendar"></i> {numPlayed} &nbsp;<i title="Seire" className="fa fa-star"></i> {numWins} &nbsp;<i title="2.plasser" className="fa fa-star-half-o"></i> {numSeconds}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PlayerSummaryPanel;
