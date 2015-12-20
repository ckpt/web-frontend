var React = require("react");

var PlayerStore = require("../stores/PlayerStore.react");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);
var _ = require("underscore");

var NoShowList = React.createClass({

  displayName: "Absentee List Widget",
  propTypes: {
    tournaments: React.PropTypes.array,
  },

  render: function() {

    var tournaments = this.props.tournaments;
    var registered = _.filter(tournaments, function(t) {
      return t.noshows && t.noshows.length;
    });

    if (!registered.length) {
      return <p><i className="fa fa-thumbs-up"></i> Ingen fravær registert!</p>;
    }

    return (
      <div className="row">
        {registered.map(function(t, i) {
          var ns = t.noshows;
          var time = moment(t.info.scheduled).format("DD.MM HH:mm");
          var absentees = ns.map(function(a, j) {
            var player = PlayerStore.getFromUUID(a.player);
            var nick = "Ukjent";
            if (player && player.nick) {
              nick = player.nick;
            }
            return <li key={"tnr-" + i + "-abscentee-" + j}><i className="fa fa-user"></i> {nick}: {a.reason}</li>;
          });
          return (
            <div key={"tnr-" + i} className="col-lg-6">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <i className="fa fa-calendar"></i> <strong>{time}</strong> --&nbsp;
                  <strong>{ns.length} fravær</strong> <i className="fa fa-thumbs-down"></i>
                </div>
                <div className="panel-body">
                  <ul className="list-unstyled">
                    {absentees}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
});

module.exports = NoShowList;
