var React = require("react");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var PlayerSummaryPanel = React.createClass({

  displayName: "Player summary panel",
  propTypes: {
    player: React.PropTypes.object
  },

  render: function() {

    var color = this.props.player.active ? "info" : "danger";
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
            Så langt i år:&nbsp;&nbsp;&nbsp;
              <i className="fa fa-money" title="Gevinst"></i> -800 &nbsp;<i title="Antall turneringer" className="fa fa-calendar"></i> 8 &nbsp;<i title="Seire" className="fa fa-star"></i> 0 &nbsp;<i title="2.plasser" className="fa fa-star-half-o"></i> 0
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PlayerSummaryPanel;
