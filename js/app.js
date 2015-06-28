// This file bootstraps the entire application.

"use strict";

var CKPTApp = require("./components/CKPTApp.react");
var Dashboard = require("./components/Dashboard.react");
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
      <Route name="dashboard" path="dashboard" handler={Dashboard}/>
      <Route name="login" path="login" handler={LoginPage}/>
      <Route name="logout" path="logout" handler={LogoutPage}/>
    </Route>
);

Router.run(routes, Router.HashLocation, function (Root) {
  React.render(<Root/>, document.getElementById("app"));
});
