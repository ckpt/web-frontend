// This file bootstraps the entire application.

"use strict";

var CKPTApp = require("./components/CKPTApp.react");
var Dashboard = require("./components/Dashboard.react");
var LocationsPage = require("./components/LocationsPage.react");
var PlayersPage = require("./components/PlayersPage.react");
var RulesPage = require("./components/RulesPage.react");
var AwardsPage = require("./components/AwardsPage.react");
var StandingsPage = require("./components/StandingsPage.react");
var StandingsSummaryPage = require("./components/StandingsSummary.react");
var ResultRegistrationPage = require("./components/ResultRegistrationPage.react");
var CalendarPage = require("./components/CalendarPage.react");
var NewsPage = require("./components/NewsPage.react");
var NewsItemPage = require("./components/NewsItemPage.react");
var LoginPage = require("./components/LoginPage.react");
var LogoutPage = require("./components/LogoutPage.react");

var React = require("react");
window.React = React; // export for http://fb.me/react-devtools

var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var routes = (
    <Route name="home" path="/" handler={CKPTApp}>
      <DefaultRoute handler={Dashboard}/>
      <Route name="login" path="login" handler={LoginPage}/>
      <Route name="logout" path="logout" handler={LogoutPage}/>

      <Route name="dashboard" path="dashboard" handler={Dashboard}/>

      <Route name="rules" path="rules" handler={RulesPage}/>
      <Route name="locations" path="locations" handler={LocationsPage}/>

      <Route name="players" path="players" handler={PlayersPage}/>
      <Route name="gossip" path="gossip" handler={Dashboard}/>
      <Route name="debt" path="debt" handler={Dashboard}/>

      <Route name="calendar" path="calendar" handler={CalendarPage}/>
      <Route name="host" path="host" handler={Dashboard}/>
      <Route name="noshow" path="noshow" handler={Dashboard}/>
      <Route name="betting" path="betting" handler={Dashboard}/>

      <Route name="standings" path="standings" handler={StandingsPage}/>
      <Route name="overview" path="overview" handler={StandingsSummaryPage}/>
      <Route name="awards" path="awards" handler={AwardsPage}/>
      <Route name="pvp" path="pvp" handler={Dashboard}/>
      <Route name="register" path="register" handler={ResultRegistrationPage}/>

      <Route name="news" path="news" handler={NewsPage}/>
      <Route name="newsDetail" path="news/:newsId" handler={NewsItemPage}/>

      <Route name="michelin" path="michelin" handler={Dashboard}/>
      <Route name="pictures" path="pictures" handler={Dashboard}/>
      <Route name="music" path="music" handler={Dashboard}/>
      <Route name="dgp" path="dgp" handler={Dashboard}/>

    </Route>
);

Router.run(routes, Router.HashLocation, function (Root) {
  React.render(<Root/>, document.getElementById("app"));
});
