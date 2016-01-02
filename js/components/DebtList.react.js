var React = require("react");

var Button = require("react-bootstrap").Button;

var PlayerStore = require("../stores/PlayerStore.react");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);
var _ = require("underscore");

var DebtList = React.createClass({

  displayName: "Debt List Widget",
  propTypes: {
    debts: React.PropTypes.array,
    player: React.PropTypes.object,
  },

  render: function() {

    var debts = this.props.debts || [];
    var player = this.props.player || null;
    var listDebitors = this.props.listDebitors || false;
    var expand = this.props.expand || false;
    var self = this;

    if (!debts.length || !this.props.onSettle) {
      return <p><i className="fa fa-thumbs-up"></i> Ingen gjeld registert!</p>;
    }

    debts = _.sortBy(debts, "created").reverse();

    return (
      <div className="table-responsive">
      <table className="table">
       <tbody>
        <tr>
        <th>Dato</th>
        {listDebitors ? <th>Debitor</th> : <th>Kreditor</th>}
        <th>Beløp</th>
        <th>Gjelder</th>
        <th>Gjort opp</th>
        </tr>
        {debts.map(function(d, i) {
          var creditor = PlayerStore.getFromUUID(d.creditor);
          var debitor = PlayerStore.getFromUUID(d.debitor);
          var created = moment(d.created).format("DD.MM.YYYY");
          var settled = d.settled && moment(d.settled) >= moment(d.created);

          if (settled && !expand) {
            return;
          }
          var settledString = settled ? moment(d.settled).format("DD.MM.YYYY") : "Nei";
          var nick = "Ukjent";
          var settleBtn = <Button className="btn btn-xs btn-outline btn-success" onClick={self.props.onSettle.bind(null, d.uuid, d.debitor)}>Innfri</Button>
          if (!listDebitors && creditor && creditor.nick) {
              nick = creditor.nick;
          }
          if (listDebitors && debitor && debitor.nick) {
            nick = debitor.nick;
          }
          if (settled || creditor.uuid != player.uuid) {
            settleBtn = "";
          }
          return <tr key={"debt-list-entry-" + i}><td>{created}</td><td>{nick}</td><td>{d.amount}</td><td>{d.description}</td><td>{settledString}&nbsp;&nbsp;{settleBtn}</td></tr>;
        })}
       </tbody>
      </table>
      </div>
    );
  }
});

module.exports = DebtList;
