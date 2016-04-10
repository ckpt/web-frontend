"use strict";

var React = require("react");

var Navigation = require("react-router").Navigation;
var SessionActionCreators = require("../actions/SessionActionCreators.react");
var SessionStore = require("../stores/SessionStore.react");
//var ErrorNotice = require("../../components/common/ErrorNotice.react.jsx");

var LoginPage = React.createClass({

  displayName: "Login page",

  getInitialState: function() {
    return { errors: [] };
  },

  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (SessionStore.isLoggedIn() && this.props && this.props.history) {
      var r = this.props.history.replace;
      console.log("We are logged in with nextPath: " + nextPath);
      var nextPath = (this.props.location && this.props.location.state && this.props.location.state.nextPathname) ? this.props.location.state.nextPathname : null;
      if (nextPath) {
        setTimeout(function() {
          r(nextPath);
        }, 10);
      } else {
        setTimeout(function() {
          r("/");
        }, 10);
      }
    }
    var errors = SessionStore.getErrors();
    if(errors.length > 0) {
      this.setState({ errors: errors });
    }
  },

  _onSubmit: function(e) {
    e.preventDefault();
    this.setState({ errors: [] });
    var username = this.refs.username.value;
    var password = this.refs.password.value;
    SessionActionCreators.login(username, password);
  },

  render: function() {
    var errors = this.state.errors.map(function(item) {
      return (
        <div><span style={{color: "red"}}>{item}</span></div>
      );
    });

    return (
      <div className="container">
        <div className="row">
          {errors}
          <div className="col-md-4 col-md-offset-4">
            <div className="login-panel panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">CKPT Pålogging</h3>
              </div>
              <div className="panel-body">
                <form role="form" onSubmit={this._onSubmit}>
                  <fieldset>
                    <div className="form-group">
                      <input className="form-control" ref="username" placeholder="Brukernavn" name="username" type="username" autofocus />
                    </div>
                    <div className="form-group">
                      <input className="form-control" ref="password" placeholder="Passord" name="password" type="password" />
                    </div>
                    <div className="checkbox">
                      <label>
                        <input name="remember" ref="remember" type="checkbox" value="remember-me" />Husk meg
                      </label>
                    </div>
                    <button type="submit" className="btn btn-lg btn-success btn-block">Logg inn</button>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LoginPage;
