var React = require("react");
var Modal = require("react-bootstrap").Modal;
var Button = require("react-bootstrap").Button;
var Input = require("react-bootstrap").Input;

var PlayerActionCreators = require("../actions/PlayerActionCreators.react");

var moment = require("moment");
var momentLocale = require("moment/locale/nb.js");
moment.locale("nb", momentLocale);

var ProfileModal = React.createClass({

  getInitialState: function() {
    return {
      profilePic: null,
      errors: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var duri = null;
    if (nextProps.player) {
      duri = "data:image/png;base64," + nextProps.player.profile.picture;
    }

    // (Re)Set initial profile picture from prop player profile
    this.setState({
      profilePic: duri
    });
  },

  picHandler: function(e) {
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.onload = function(upload) {
      self.setState({
       profilePic: upload.target.result
      });
    };

    reader.readAsDataURL(file);
  },

  saveProfile: function(e) {
    e.preventDefault();
    // TODO: validate form data, update error state

    // preprocess data and put in object
    var name = this.refs.name.getValue().trim();
    var email = this.refs.email.getValue().trim();
    var description = this.refs.description.getValue().trim();
    var birthday = moment(this.refs.birthday.getValue().trim(), "DD.MM.YYYY");
    var picture = this.state.profilePic.split(",")[1];

    var profile = {
      name: name,
      email: email,
      description: description,
      birthday: birthday,
      picture: picture
    };

    PlayerActionCreators.savePlayerProfile(this.props.player.uuid, profile);
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

    var nick = this.props.player ? this.props.player.nick : "Ukjent";
    var img = this.state.profilePic ? <img height="120px" src={this.state.profilePic} /> : "";
    var email = this.props.player ? this.props.player.profile.email : null;
    var description = this.props.player ? this.props.player.profile.description : null;
    var name = this.props.player ? this.props.player.profile.name : null;
    var birthday = this.props.player ? moment(this.props.player.profile.birthday).format("DD.MM.YYYY") : null;
    return (
      <Modal {...this.props} bsSize='medium' aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Spillerprofil for <strong>{nick}</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors}
          <form>
            {img}
            <Input type='file' onChange={this.picHandler} accept="image/png" label='Last opp profilbilde' help="Bruk et PNG-bilde (helst kvadratisk ca 100x100px)"/>
            <Input style={{clear: "both"}} type='text' ref="name" label='Navn' placeholder='Fullt navn' defaultValue={name} />
            <Input type='email' label='Epostadresse' ref="email" placeholder='Legg inn epost' defaultValue={email} />
            <Input type='text' label='Beskrivelse' ref="description" placeholder='Si noe kort om deg selv..' defaultValue={description} />
            <Input type='text' label='Fødselsdag' ref="birthday" placeholder='DD.MM.ÅÅÅÅ' defaultValue={birthday} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Avbryt</Button>
          <Button onClick={this.saveProfile} bsStyle="primary">Lagre profil</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = ProfileModal;
