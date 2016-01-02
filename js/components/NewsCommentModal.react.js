var React = require("react");
var Modal = require("react-bootstrap").Modal;
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var NewsActionCreators = require("../actions/NewsActionCreators.react");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var NewsCommentModal = React.createClass({

  getInitialState: function() {
    return {
      item: {
        content: "",
      },
      errors: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      errors: []
    });
  },

  addComment: function(e) {
    e.preventDefault();
    // TODO: validate form data, update error state

    // preprocess data and put in object
    var body = this.refs.body.getValue().trim();

    if (!body) {
      this.setState({errors: ["Kommentaren kan ikke være tom"]});
      this.refs.body.getInputDOMNode().focus();
      return;
    }

    var commentData = {
      content: body.replace(/\n/g, "\\n"),
    };

    var it = this.props.item || this.state.item;
    NewsActionCreators.addComment(it.uuid, commentData);
    this.props.onHide();
  },

  render: function() {
    var errors = this.state.errors.map(function(item, i) {
      return (
          <div className="alert alert-danger" key={"alert-" + i}>
            {item}
          </div>
      );
    });

    var it = this.props.item || this.state.item;
    var modaltitle = "Opprett ny kommentar";

    return (
      <Modal {...this.props} bsSize='medium' aria-labelledby='contained-modal-newsitem-comment'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-newsitem-comment'>{modaltitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors}
          <form>
            <Input type='textarea' rows="10" ref="body" label="Kommentar" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Avbryt</Button>
          <Button onClick={this.addComment} bsStyle="primary">Lagre kommentar</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = NewsCommentModal;
