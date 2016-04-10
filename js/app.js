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
var HostPage = require("./components/HostPage.react");
var NoShowPage = require("./components/NoShowPage.react");
var DebtPage = require("./components/DebtPage.react");
var GossipPage = require("./components/GossipPage.react");
var LoginPage = require("./components/LoginPage.react");
var LogoutPage = require("./components/LogoutPage.react");

var SessionStore = require("./stores/SessionStore.react");

var React = require("react");
var ReactDOM = require("react-dom");
window.React = React; // export for http://fb.me/react-devtools

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var createHashHistory = require('history/lib/createHashHistory');
var myHist = createHashHistory();

var routes = (
    <Route path="/" component={CKPTApp}>
      <IndexRoute component={Dashboard} onEnter={requireAuth}/>
      <Route path="login" component={LoginPage}/>
      <Route path="logout" component={LogoutPage}/>

      <Route path="dashboard" component={Dashboard} onEnter={requireAuth}/>

      <Route path="rules" component={RulesPage} onEnter={requireAuth}/>
      <Route path="locations" component={LocationsPage} onEnter={requireAuth}/>

      <Route path="players" component={PlayersPage} onEnter={requireAuth}/>
      <Route path="gossip" component={GossipPage} onEnter={requireAuth}/>
      <Route path="debt" component={DebtPage} onEnter={requireAuth}/>

      <Route path="calendar" component={CalendarPage} onEnter={requireAuth}/>
      <Route path="host" component={HostPage} onEnter={requireAuth}/>
      <Route path="noshow" component={NoShowPage} onEnter={requireAuth}/>
      <Route path="betting" component={Dashboard} onEnter={requireAuth}/>

      <Route path="standings" component={StandingsPage} onEnter={requireAuth}/>
      <Route path="overview" component={StandingsSummaryPage} onEnter={requireAuth}/>
      <Route path="awards" component={AwardsPage} onEnter={requireAuth}/>
      <Route path="pvp" component={Dashboard} onEnter={requireAuth}/>
      <Route path="register" component={ResultRegistrationPage} onEnter={requireAuth}/>

      <Route path="news" component={NewsPage} onEnter={requireAuth}/>
      <Route path="news/:newsId" component={NewsItemPage} onEnter={requireAuth}/>

      <Route path="michelin" component={Dashboard} onEnter={requireAuth}/>
      <Route path="pictures" component={Dashboard} onEnter={requireAuth}/>
      <Route path="music" component={Dashboard} onEnter={requireAuth}/>
      <Route path="dgp" component={Dashboard} onEnter={requireAuth}/>

    </Route>
);

function requireAuth(nextState, replaceState) {
  if (!SessionStore.isLoggedIn()) {
     replaceState({ nextPathname: nextState.location.pathname }, '/login')
  }
}

ReactDOM.render(<Router history={myHist}>{routes}</Router>, document.getElementById("app"));
