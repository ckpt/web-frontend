var React = require("react");

var StandingsTableEntry = React.createClass({
  displayName: "StandingsTableEntry",

  propTypes: {
    data: React.PropTypes.array,
    length: React.PropTypes.number,
    num: React.PropTypes.number
  },

  render: function() {
    var headingClass = "";
    if (this.props.num === this.props.length - 1) {
      headingClass = "danger";
    } else if (this.props.num === 0) {
      headingClass = "warning";
    }

    return (
      <tr className={headingClass}>
        <td>{this.props.num + 1}</td>
        {this.props.data.map(function (item, i) {
          return (
            <td key={"field-" + i}>{item}</td>
          );
         })}
      </tr>
    );
  }
});

module.exports = StandingsTableEntry;
