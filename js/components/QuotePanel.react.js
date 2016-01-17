var React = require("react");
var _ = require("underscore");

var QuotePanel = React.createClass({

  displayName: "Quote Panel",

  propTypes: {
    quotes: React.PropTypes.arrayOf(React.PropTypes.object),
    title: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      quote: null,
      timer: null
    };
  },

  componentDidMount: function() {
    this.state.timer = setInterval(this._onChange, 5000);
  },

  componentWillUnmount: function() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
      this.state.timer = null;
    }
  },

  componentWillRecieveProps: function(nextProps) {
    this.setState({
      quote: _.sample(nextProps.quotes)
    });
  },

  _onChange: function() {
    this.setState({
      quote: this._getRandomQuote()
    });
  },

  _getRandomQuote: function() {
    return _.sample(this.props.quotes);
  },

  render: function() {

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <i className="fa fa-quote-right fa-fw"></i> {this.props.title}
        </div>
        <div className="panel-body">
          <blockquote>
            <p>{this.state.quote ? this.state.quote.quote : "Laster..."}</p>
            <h4 className="pull-right text-muted">-- {this.state.quote ? this.state.quote.nick : ""}</h4>
          </blockquote>
        </div>
      </div>
    );
  }
});

module.exports = QuotePanel;
