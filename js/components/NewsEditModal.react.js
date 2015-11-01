var React = require("react");
var Modal = require("react-bootstrap").Modal;
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var NewsActionCreators = require("../actions/NewsActionCreators.react");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var NewsEditModal = React.createClass({

  getInitialState: function() {
    return {
      item: {
        uuid: null,
        title: "",
        leadin: "",
        body: ""
      },
      errors: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      errors: []
    });
  },

  saveNewsItem: function(e) {
    e.preventDefault();
    // TODO: validate form data, update error state

    // preprocess data and put in object
    var title = this.refs.title.getValue().trim();
    var leadin = this.refs.leadin.getValue().trim();
    var body = this.refs.body.getValue().trim();
    var tag = parseInt(this.refs.tag.getValue());

    if (!title) {
      this.setState({errors: ["Saken må ha en tittel"]});
      this.refs.title.getInputDOMNode().focus();
      return;
    }

    if (!leadin && !body) {
      this.setState({errors: ["Saken må ha ingress eller tekst"]});
      this.refs.leadin.getInputDOMNode().focus();
      return;
    }

    var itemData = {
      title: title,
      leadin: leadin.replace(/\n/g, "\\n"),
      body: body.replace(/\n/g, "\\n"),
      tag: tag
    };

    var it = this.props.item || this.state.item;

    if (it.uuid) {
      console.log("Would update news item " + it.uuid + " with data:")
      console.log(itemData)
      NewsActionCreators.updateNewsItem(it.uuid, itemData);
    } else {
      console.log("Would create news item with data:")
      console.log(itemData)
      NewsActionCreators.createNewsItem(itemData);
    }
    this.props.onHide();
    NewsActionCreators.loadNewsItems();
  },

  render: function() {
    var errors = this.state.errors.map(function(item, i) {
      return (
          <div className="alert alert-danger" key={"alert-" + i}>
            {item}
          </div>
      );
    });

    var tagTitles = ["Nyhet",  "Analyse", "Strategiavsløring", "Mattips"];

    var it = this.props.item || this.state.item;
    var modaltitle = it.uuid ? "Rediger sak" : "Opprett ny sak";
    var currentTag = this.props.tag ? this.props.tag : (it.tag ? it.tag : 0);
    currentTag = parseInt(currentTag);

    return (
      <Modal {...this.props} bsSize='medium' aria-labelledby='contained-modal-newsitem'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-newsitem'>{modaltitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors}
          <form>
            <Input type='text' ref="title" label="Tittel" defaultValue={it.title} />
            <Input type="select" ref="tag" label="Type sak">
              {tagTitles.map(function(title, i) {
                var selected = (i === currentTag ? "selected" : "");
                return <option value={i} selected={selected}>{title}</option>;
              })}
            </Input>
            <Input type='textarea' rows="5" ref="leadin" label="Ingress" defaultValue={it.leadin.replace(/\\n/g, "\n")} />
            <Input type='textarea' rows="10" ref="body" label="Tekst" defaultValue={it.body.replace(/\\n/g, "\n")} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Avbryt</Button>
          <Button onClick={this.saveNewsItem} bsStyle="primary">Lagre sak</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = NewsEditModal;
