"use strict";

var React = require("react");

var Navbar = require("./Navbar.react");
var SessionStore = require("../stores/SessionStore.react");

var Dashboard = require("./Dashboard.react");
var LocationsPage = require("./LocationsPage.react");
var PlayersPage = require("./PlayersPage.react");
var RulesPage = require("./RulesPage.react");
var AwardsPage = require("./AwardsPage.react");
var StandingsPage = require("./StandingsPage.react");
var StandingsSummaryPage = require("./StandingsSummary.react");
var ResultRegistrationPage = require("./ResultRegistrationPage.react");
var CalendarPage = require("./CalendarPage.react");
var NewsPage = require("./NewsPage.react");
var NewsItemPage = require("./NewsItemPage.react");
var HostPage = require("./HostPage.react");
var NoShowPage = require("./NoShowPage.react");
var DebtPage = require("./DebtPage.react");
var GossipPage = require("./GossipPage.react");
var LoginPage = require("./LoginPage.react");
var LogoutPage = require("./LogoutPage.react");

import { Route, Switch, Redirect } from 'react-router-dom'

const RequireAuth = (Component) => {

  return class App extends Component {

      getInitialState() {
        var _state = {
          loggedIn: SessionStore.isLoggedIn(),
          user: SessionStore.getUsername(),
          isAdmin: SessionStore.isAdmin(),
          errors: SessionStore.getErrors(),
          currentSeason: new Date().getFullYear()
        };
        return _state;
      }

      render() {
        if(!this.state.loggedIn) {
          console.log("Issuing login redirect");
          return <Redirect to="/login"/>;
        }
        return <Component {...this.props} isAdmin={this.state.isAdmin} username={this.state.user} currentSeason={this.state.currentSeason}/>;
      }
  }

};

var CKPTApp = React.createClass({

  displayName: "CKPT App",

  render: function() {
    console.log(this);
    var layout = (
        <Switch>
          <Route exact path="/" component={RequireAuth(Dashboard)}/>
          <Route path="/login" component={LoginPage}/>
          <Route path="/logout" component={LogoutPage}/>

          <Route path="/dashboard" component={RequireAuth(Dashboard)}/>

          <Route path="/rules" component={RequireAuth(RulesPage)}/>
          <Route path="/locations" component={RequireAuth(LocationsPage)}/>

          <Route path="/players" component={RequireAuth(PlayersPage)}/>
          <Route path="/gossip" component={RequireAuth(GossipPage)}/>
          <Route path="/debt" component={RequireAuth(DebtPage)}/>

          <Route path="/calendar" component={RequireAuth(CalendarPage)}/>
          <Route path="/host" component={RequireAuth(HostPage)}/>
          <Route path="/noshow" component={RequireAuth(NoShowPage)}/>
          <Route path="/betting" component={RequireAuth(Dashboard)}/>

          <Route path="/standings" component={RequireAuth(StandingsPage)}/>
          <Route path="/overview" component={RequireAuth(StandingsSummaryPage)}/>
          <Route path="/awards" component={RequireAuth(AwardsPage)}/>
          <Route path="/pvp" component={RequireAuth(Dashboard)}/>
          <Route path="/register" component={RequireAuth(ResultRegistrationPage)}/>

          <Route path="/news" component={RequireAuth(NewsPage)}/>
          <Route path="/news/:newsId" component={RequireAuth(NewsItemPage)}/>

          <Route path="/michelin" component={RequireAuth(Dashboard)}/>
          <Route path="/pictures" component={RequireAuth(Dashboard)}/>
          <Route path="/music" component={RequireAuth(Dashboard)}/>
          <Route path="/dgp" component={RequireAuth(Dashboard)}/>
        </Switch>
    );

    var AuthNavbar = RequireAuth(Navbar);

    if (SessionStore.isLoggedIn()) {
      return (
        <div id="wrapper">
          <AuthNavbar {...this.props} currentPath={this.props.location.pathname}/>);
          {layout}
        </div>
      );
    } else {
      return layout;
    }
  }
});

export default CKPTApp;
