var React = require("react");
var ResultTableEntry = require("./ResultTableEntry.react.js");

var _ = require("underscore");

var ResultsTable = React.createClass({

  displayName: "Results table",
  propTypes: {
    entries: React.PropTypes.arrayOf(React.PropTypes.array),
    title: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      headings: ["Col 1", "Col 2"],
      entries: [
        [ "Item 1", "Value 1" ],
        [ "Item 2", "Value 2" ]
      ],
      title: "My results table"
    };
  },

  _generateHeadings: function() {
    var headings = [];
    var maxlen = _.max(this.props.entries, function(entry) { return entry.length; }).length;
    for (var i = 1; i < maxlen; i++) {
      headings.push("#" + i);
    }
    return headings;
  },

  render: function() {
    var noItems = this.props.entries.length;
    var headings = this._generateHeadings();
    return (
      <div className="panel panel-default">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Dato</th>
                {headings.map(function (item, i) {
                  return <th key={"heading-" + i}>{item}</th>;
                 })}
              </tr>
            </thead>
            <tbody>
              {this.props.entries.map(function (item, i) {
                return (
                  <ResultTableEntry data={item} key={i} length={noItems} num={i} />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = ResultsTable;
