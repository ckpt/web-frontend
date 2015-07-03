var React = require("react");
var StandingsTableEntry = require("./StandingsTableEntry.react");

var StandingsTable = React.createClass({

  displayName: "StandingsTable",
  propTypes: {
    entries: React.PropTypes.arrayOf(React.PropTypes.array),
    headings: React.PropTypes.arrayOf(React.PropTypes.string),
    title: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      headings: ["Col 1", "Col 2"],
      entries: [
        [ "Item 1", "Value 1" ],
        [ "Item 2", "Value 2" ]
      ],
      title: "My standings table"
    };
  },

  render: function() {
    var noItems = this.props.entries.length;
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <i className="fa fa-table fa-fw"></i> {this.props.title}
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                {this.props.headings.map(function (item, i) {
                  return <th key={"heading-" + i}>{item}</th>;
                 })}
              </tr>
            </thead>
            <tbody>
              {this.props.entries.map(function (item, i) {
                return (
                  <StandingsTableEntry data={item} key={i} length={noItems} num={i} />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = StandingsTable;
