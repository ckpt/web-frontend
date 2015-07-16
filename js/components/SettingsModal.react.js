var React = require("react");
var Modal = require("react-bootstrap").Modal;
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var PlayerActionCreators = require("../actions/PlayerActionCreators.react");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var SettingsModal = React.createClass({

  getInitialState: function() {
    return {
      errors: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      errors: []
    });
  },

  saveSettings: function(e) {
    e.preventDefault();
    // TODO: validate form data, update error state

    // preprocess data and put in object
    var pw1 = this.refs.newpass.getValue().trim();
    var pw2 = this.refs.newpass2.getValue().trim();
    //var  = this.refs.description.getValue().trim();
    //var birthday = moment(this.refs.birthday.getValue().trim(), "DD.MM.YYYY");
    //var picture = this.state.profilePic.split(",")[1];

    if (pw1 !== pw2) {
      this.setState({errors: ["Passordene må være like"]});
      this.refs.newpass2.getInputDOMNode().focus();
      return;
    }

    var settings = {};
    var password = null;

    if (pw1 && pw2) {
      if (pw1.length < 6) {
        this.setState({errors: ["Passordet må være minst 6 tegn"]});
        this.refs.newpass.getInputDOMNode().focus();
        return;
      }
      password = pw1;
    }

    PlayerActionCreators.saveUserSettings(this.props.player.uuid, settings, password);
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

    var apikey = this.props.player ? this.props.player.user.apikey : "Ikke satt";

    return (
      <Modal {...this.props} bsSize='small' aria-labelledby='contained-modal-settings'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-settings'>Innstillinger for <strong>{this.props.username}</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors}
          <form>
            <Input type='text' label="API nøkkel" defaultValue={apikey} readOnly />
            <Input type='password' ref="newpass" label="Nytt passord" />
            <Input type='password' ref="newpass2" label="Gjenta nytt passord" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Avbryt</Button>
          <Button onClick={this.saveSettings} bsStyle="primary">Lagre innstilinger</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = SettingsModal;
