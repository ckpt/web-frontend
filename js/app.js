// This file bootstraps the entire application.

"use strict";

var CKPTApp = require("./components/CKPTApp.react");
var Dashboard = require("./components/Dashboard.react");
var LocationsPage = require("./components/LocationsPage.react");
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

      <Route name="rules" path="rules" handler={Dashboard}/>
      <Route name="locations" path="locations" handler={LocationsPage}/>

      <Route name="players" path="players" handler={Dashboard}/>
      <Route name="gossip" path="gossip" handler={Dashboard}/>
      <Route name="debt" path="debt" handler={Dashboard}/>

      <Route name="calendar" path="calendar" handler={Dashboard}/>
      <Route name="host" path="host" handler={Dashboard}/>
      <Route name="noshow" path="noshow" handler={Dashboard}/>
      <Route name="betting" path="betting" handler={Dashboard}/>

      <Route name="standings" path="standings" handler={Dashboard}/>
      <Route name="overview" path="overview" handler={Dashboard}/>
      <Route name="awards" path="awards" handler={Dashboard}/>
      <Route name="pvp" path="pvp" handler={Dashboard}/>
      <Route name="register" path="register" handler={Dashboard}/>

      <Route name="news" path="news" handler={Dashboard}/>

      <Route name="michelin" path="michelin" handler={Dashboard}/>
      <Route name="pictures" path="pictures" handler={Dashboard}/>
      <Route name="music" path="music" handler={Dashboard}/>
      <Route name="dgp" path="dgp" handler={Dashboard}/>

    </Route>
);

Router.run(routes, Router.HashLocation, function (Root) {
  React.render(<Root/>, document.getElementById("app"));
});
