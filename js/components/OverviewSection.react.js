var React = require("react");
var OverviewPanel = require("./OverviewPanel.react");

var OverviewSection = React.createClass({

  displayName: "OverviewSection",
  propTypes: {
    items: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getDefaultProps: function() {
    return {
      heading: "Heading text",
      items: [
        {
          icon: "money",
          maintext: "-400",
          subtext: "Gevinst i 2015",
          color: "red",
          link: {
            target: "#",
            text: "Se årets resultater"
          }
        },
        {
          icon: "tasks",
          maintext: "4",
          subtext: "Uløste oppgaver!",
          color: "success",
          link: {
            target: "#",
            text: "Se hvilke"
          }
        },
        {
          icon: "trophy",
          maintext: "Lars Vegas",
          subtext: "Leder årets turnering",
          color: "yellow",
          link: {
            target: "#",
            text: "Se sammenlagtoversikt"
          }
        },
        {
          icon: "home",
          maintext: "Heimdal",
          subtext: "Neste turnering er 20.06",
          color: "info",
          link: {
            target: "#",
            text: "Mer informasjon"
          }
        }
      ]
    };
  },

  render: function() {
    return (
      <section>
        <p></p>
        {this.props.items.map(function(item, i) {
          return (
            <div className="col-lg-3 col-md-6" key={i}>
            <OverviewPanel item={item} key={"overviewitem-" + i}/>
            </div>
          );
         })}
      </section>
    );
  }
});

module.exports = OverviewSection;
