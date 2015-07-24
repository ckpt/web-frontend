var React = require("react");

var ResultTableEntry = React.createClass({
  displayName: "ResultTableEntry",

  propTypes: {
    data: React.PropTypes.array,
    length: React.PropTypes.number,
    num: React.PropTypes.number
  },

  render: function() {

    return (
      <tr style={{borderBottom: "1px"}} >
        {this.props.data.map(function (item, i) {
          return (
            <td style={{borderTop: "none"}} key={"field-" + i}>{item}</td>
          );
         })}
      </tr>
    );
  }
});

module.exports = ResultTableEntry;
